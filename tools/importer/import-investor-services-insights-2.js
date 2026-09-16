/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroArticleParser from './parsers/hero-article.js';
import sharingArticleParser from './parsers/sharing-article.js';
import cardsUpNextParser from './parsers/cards-up-next.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/bbh-cleanup.js';
import sectionsTransformer from './transformers/bbh-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-article': heroArticleParser,
  'sharing-article': sharingArticleParser,
  'cards-up-next': cardsUpNextParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'investor-services-insights-2',
  description: 'BBH insights article (long-form body): split article hero, social share row, article body (default content with pull quotes/highlights/inline chart), Up Next recirculation card, legal disclaimer',
  urls: [
    'https://www.bbh.com/us/en/insights/investor-services-insights/when-ai-makes-experts-better-clients-win.html',
  ],
  blocks: [
    {
      name: 'hero-article',
      instances: ['.cmp-teaser--up-next-v2'],
    },
    {
      name: 'sharing-article',
      instances: ['.cmp-sharing-left'],
    },
    {
      name: 'cards-up-next',
      instances: ['.cmp-teaser--smaller-crop-v2'],
    },
  ],
  sections: [
    {
      id: 'article-hero',
      name: 'article-hero',
      selector: ['.cmp-teaser--up-next-v2'],
      style: null,
      blocks: ['hero-article'],
      defaultContent: [],
    },
    {
      id: 'social-share',
      name: 'social-share',
      selector: ['.cmp-sharing-left'],
      style: null,
      blocks: ['sharing-article'],
      defaultContent: [],
    },
    {
      id: 'article-body',
      name: 'article-body',
      selector: ['.cmp-container--one-column-text'],
      style: null,
      blocks: [],
      defaultContent: ['.cmp-container--one-column-text'],
    },
    {
      id: 'up-next',
      name: 'up-next',
      selector: ['.cmp-teaser--smaller-crop-v2'],
      style: 'grey',
      blocks: ['cards-up-next'],
      defaultContent: [],
    },
    {
      id: 'disclaimer',
      name: 'disclaimer',
      selector: ['.bbh-text--disclaimer'],
      style: 'grey',
      blocks: [],
      defaultContent: ['.bbh-text--disclaimer'],
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
 * Deepest-first so nested blocks parse before ancestors.
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
