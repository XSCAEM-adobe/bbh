/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import columnsBusinessLinesParser from './parsers/columns-business-lines.js';
import columnsStatementParser from './parsers/columns-statement.js';
import carouselInsightsParser from './parsers/carousel-insights.js';
import columnsStatsParser from './parsers/columns-stats.js';
import cardsReportsParser from './parsers/cards-reports.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/bbh-cleanup.js';
import sectionsTransformer from './transformers/bbh-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'columns-business-lines': columnsBusinessLinesParser,
  'columns-statement': columnsStatementParser,
  'carousel-insights': carouselInsightsParser,
  'columns-stats': columnsStatsParser,
  'cards-reports': cardsReportsParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'home',
  description: 'BBH US home page: hero with two promo panels, red what-we-do statement, featured insights carousel, stats, and stakeholder report cards',
  urls: [
    'https://www.bbh.com/us/en.html',
  ],
  blocks: [
    {
      name: 'hero-banner',
      instances: ['.cmp-teaser--hero-page-v2'],
    },
    {
      name: 'columns-business-lines',
      instances: ['.cmp-teaser--hero-page-v2 .cmp-list__list-container'],
    },
    {
      name: 'columns-statement',
      instances: ['.cmp-teaser--card-v2.bbh-container-background__red'],
    },
    {
      name: 'carousel-insights',
      instances: ['.cmp-teaser--card-v3 .cmp-list__list-container'],
    },
    {
      name: 'columns-stats',
      instances: ['.cmp-list--teaser--stat.cmp-list--four-column'],
    },
    {
      name: 'cards-reports',
      instances: ['.cmp-teaser--card.top.list.aem-GridColumn--default--12:not(.cmp-teaser--card-v2):not(.cmp-teaser--card-v3):not(.cmp-list--teaser--stat)'],
    },
  ],
  sections: [
    {
      id: 'hero',
      name: 'hero',
      selector: ['.cmp-teaser--hero-page-v2'],
      style: 'dark',
      blocks: ['hero-banner', 'columns-business-lines'],
      defaultContent: [],
    },
    {
      id: 'what-we-do',
      name: 'what-we-do',
      selector: ['.cmp-teaser--card-v2.bbh-container-background__red'],
      style: 'deep-red',
      blocks: ['columns-statement'],
      defaultContent: [],
    },
    {
      id: 'featured-insights',
      name: 'featured-insights',
      selector: ['.cmp-teaser--card-v3'],
      style: null,
      blocks: ['carousel-insights'],
      defaultContent: ['.cmp-teaser--card-v3 .cmp-list__description', '.cmp-teaser--card-v3 .cmp-list__CTA'],
    },
    {
      id: 'bbh-by-the-numbers',
      name: 'bbh-by-the-numbers',
      selector: ['.cmp-list--teaser--stat.cmp-list--four-column'],
      style: null,
      blocks: ['columns-stats'],
      defaultContent: ['.cmp-list--teaser--stat .cmp-list__description'],
    },
    {
      id: 'stakeholder-reports',
      name: 'stakeholder-reports',
      selector: ['.cmp-teaser--card.top.list.aem-GridColumn--default--12:not(.cmp-teaser--card-v2):not(.cmp-teaser--card-v3):not(.cmp-list--teaser--stat)'],
      style: null,
      blocks: ['cards-reports'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY (section transformer runs after cleanup)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook.
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration.
 * Results are sorted deepest-first (by DOM depth) so nested blocks are parsed
 * before their ancestors — e.g. columns-business-lines lives inside the
 * hero-banner container, and the hero parser replaces that container wholesale.
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        let depth = 0;
        let node = element;
        while (node.parentElement) {
          depth += 1;
          node = node.parentElement;
        }
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          depth,
          section: blockDef.section || null,
        });
      });
    });
  });

  // Deepest elements first, so descendant blocks parse before ancestor blocks.
  pageBlocks.sort((a, b) => b.depth - a.depth);

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (cleanup + section break markers)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks (deepest-first)
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block; skip any already detached by an earlier parser.
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized path (map root URL to /index)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
