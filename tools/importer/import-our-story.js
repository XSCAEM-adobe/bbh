/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import breadcrumbParser from './parsers/breadcrumb.js';
import columnsReportDownloadParser from './parsers/columns-report-download.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/bbh-cleanup.js';
import sectionsTransformer from './transformers/bbh-sections.js';

// PARSER REGISTRY
const parsers = {
  breadcrumb: breadcrumbParser,
  'columns-report-download': columnsReportDownloadParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'our-story',
  description: 'BBH 2025 Annual Report landing page: red title band + report download feature (cover image, intro, table of contents, Download/Print CTAs)',
  urls: [
    'https://www.bbh.com/us/en/bbh-who-we-are/our-story/2025-annual-report.html',
  ],
  blocks: [
    {
      name: 'breadcrumb',
      instances: ['.breadcrumb'],
    },
    {
      name: 'columns-report-download',
      instances: ['.cmp-print'],
    },
  ],
  sections: [
    {
      id: 'page-title',
      name: 'page-title',
      selector: ['.cmp-teaser--red-ribbon-only-text'],
      style: 'deep-red',
      blocks: [],
      defaultContent: ['.cmp-teaser--red-ribbon-only-text'],
    },
    {
      id: 'breadcrumb',
      name: 'breadcrumb',
      selector: ['.breadcrumb'],
      style: null,
      blocks: ['breadcrumb'],
      defaultContent: [],
    },
    {
      id: 'report-download',
      name: 'report-download',
      selector: ['.cmp-print'],
      style: null,
      blocks: ['columns-report-download'],
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
