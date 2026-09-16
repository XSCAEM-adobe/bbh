/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document: document2 }) {
    const img = element.querySelector(".cmp-teaser__image img, img.cmp-image__image");
    const heading = element.querySelector(".cmp-teaser__title-wrapper h1, .cmp-teaser__title-wrapper h2, h1.cmp-teaser__title");
    if (!img && !heading) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (img) {
      const imageCell = document2.createDocumentFragment();
      imageCell.appendChild(document2.createComment(" field:image "));
      imageCell.appendChild(img);
      cells.push([imageCell]);
    }
    const textCell = document2.createDocumentFragment();
    textCell.appendChild(document2.createComment(" field:text "));
    if (heading) textCell.appendChild(heading);
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-business-lines.js
  function parse2(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(":scope > ul > li.cmp-list__item, :scope li.cmp-list__item"));
    if (!items.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const columnCells = items.map((item) => {
      const cell = [];
      const title = item.querySelector(".cmp-teaser__title");
      const desc = item.querySelector(".cmp-teaser__description");
      const cta = item.querySelector('.cmp-teaser__action-link, a[class*="action-link"]');
      if (title) cell.push(title);
      if (desc) cell.push(desc);
      if (cta) cell.push(cta);
      return cell;
    });
    const cells = [columnCells];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-business-lines", cells });
    const heroAncestor = element.closest(".cmp-teaser--hero-page-v2");
    if (heroAncestor && heroAncestor.parentNode) {
      heroAncestor.after(block);
      element.remove();
    } else {
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/columns-statement.js
  function parse3(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(":scope li.cmp-list__item"));
    if (!items.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const columnCells = items.map((item) => {
      const cell = [];
      const title = item.querySelector(".cmp-teaser__title");
      const desc = item.querySelector(".cmp-teaser__description");
      if (title) cell.push(title);
      if (desc) cell.push(desc);
      return cell;
    });
    const cells = [columnCells];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-statement", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-insights.js
  function parse4(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll("li.cmp-list__item"));
    const seen = /* @__PURE__ */ new Set();
    const cells = [];
    items.forEach((item) => {
      const titleLink = item.querySelector(".cmp-teaser__title-link, .cmp-teaser__title a");
      const key = titleLink ? titleLink.getAttribute("href") : null;
      if (key) {
        if (seen.has(key)) return;
        seen.add(key);
      }
      const img = item.querySelector(".cmp-teaser__image img, img.cmp-image__image");
      const title = item.querySelector(".cmp-teaser__title");
      const cta = item.querySelector('.cmp-teaser__action-link, a[class*="action-link"]');
      if (!img && !title) return;
      const imageCell = document2.createDocumentFragment();
      imageCell.appendChild(document2.createComment(" field:image "));
      if (img) imageCell.appendChild(img);
      const textCell = document2.createDocumentFragment();
      textCell.appendChild(document2.createComment(" field:text "));
      if (title) textCell.appendChild(title);
      if (cta) textCell.appendChild(cta);
      cells.push([imageCell, textCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-insights", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-stats.js
  function parse5(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(":scope li.cmp-list__item"));
    if (!items.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const columnCells = items.map((item) => {
      const cell = [];
      const title = item.querySelector(".cmp-teaser__title");
      const desc = item.querySelector(".cmp-teaser__description");
      if (title) cell.push(title);
      if (desc) cell.push(desc);
      return cell;
    });
    const cells = [columnCells];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-stats", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-reports.js
  function parse6(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll("li.cmp-list__item"));
    if (!items.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const sectionTitle = Array.from(element.querySelectorAll("h1, h2, h3")).find((h) => !h.closest("li.cmp-list__item"));
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector(".cmp-teaser__image img, img.cmp-image__image");
      const title = item.querySelector(".cmp-teaser__title-wrapper h2, .cmp-teaser__title");
      const desc = item.querySelector(".cmp-teaser__description");
      if (!img && !title) return;
      const imageCell = document2.createDocumentFragment();
      imageCell.appendChild(document2.createComment(" field:image "));
      if (img) imageCell.appendChild(img);
      const textCell = document2.createDocumentFragment();
      textCell.appendChild(document2.createComment(" field:text "));
      if (title) textCell.appendChild(title);
      if (desc) textCell.appendChild(desc);
      cells.push([imageCell, textCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-reports", cells });
    if (sectionTitle) {
      const heading = document2.createElement(sectionTitle.tagName.toLowerCase());
      heading.textContent = sectionTitle.textContent.trim();
      element.replaceWith(heading, block);
    } else {
      element.replaceWith(block);
    }
  }

  // tools/importer/transformers/bbh-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        ".cmp-modal",
        ".cmp-alert",
        ".alert"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "nav",
        ".bbh-header__accessible-container",
        ".skip-to-content",
        "#absoluteTop",
        "#absoluteBottom",
        "#curtain",
        ".bbh-header__search-form",
        "form",
        "input",
        "iframe",
        "noscript",
        "script",
        "style",
        "link"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("onclick");
        el.removeAttribute("data-track");
        el.removeAttribute("data-cmp-data-layer");
      });
    }
  }

  // tools/importer/transformers/bbh-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    for (const sel of selectors || []) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload && payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || querySection(element, section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-home.js
  var parsers = {
    "hero-banner": parse,
    "columns-business-lines": parse2,
    "columns-statement": parse3,
    "carousel-insights": parse4,
    "columns-stats": parse5,
    "cards-reports": parse6
  };
  var PAGE_TEMPLATE = {
    name: "home",
    description: "BBH US home page: hero with two promo panels, red what-we-do statement, featured insights carousel, stats, and stakeholder report cards",
    urls: [
      "https://www.bbh.com/us/en.html"
    ],
    blocks: [
      {
        name: "hero-banner",
        instances: [".cmp-teaser--hero-page-v2"]
      },
      {
        name: "columns-business-lines",
        instances: [".cmp-teaser--hero-page-v2 .cmp-list__list-container"]
      },
      {
        name: "columns-statement",
        instances: [".cmp-teaser--card-v2.bbh-container-background__red"]
      },
      {
        name: "carousel-insights",
        instances: [".cmp-teaser--card-v3 .cmp-list__list-container"]
      },
      {
        name: "columns-stats",
        instances: [".cmp-list--teaser--stat.cmp-list--four-column"]
      },
      {
        name: "cards-reports",
        instances: [".cmp-teaser--card.top.list.aem-GridColumn--default--12:not(.cmp-teaser--card-v2):not(.cmp-teaser--card-v3):not(.cmp-list--teaser--stat)"]
      }
    ],
    sections: [
      {
        id: "hero",
        name: "hero",
        selector: [".cmp-teaser--hero-page-v2"],
        style: "dark",
        blocks: ["hero-banner", "columns-business-lines"],
        defaultContent: []
      },
      {
        id: "what-we-do",
        name: "what-we-do",
        selector: [".cmp-teaser--card-v2.bbh-container-background__red"],
        style: "deep-red",
        blocks: ["columns-statement"],
        defaultContent: []
      },
      {
        id: "featured-insights",
        name: "featured-insights",
        selector: [".cmp-teaser--card-v3"],
        style: null,
        blocks: ["carousel-insights"],
        defaultContent: [".cmp-teaser--card-v3 .cmp-list__description", ".cmp-teaser--card-v3 .cmp-list__CTA"]
      },
      {
        id: "bbh-by-the-numbers",
        name: "bbh-by-the-numbers",
        selector: [".cmp-list--teaser--stat.cmp-list--four-column"],
        style: null,
        blocks: ["columns-stats"],
        defaultContent: [".cmp-list--teaser--stat .cmp-list__description"]
      },
      {
        id: "stakeholder-reports",
        name: "stakeholder-reports",
        selector: [".cmp-teaser--card.top.list.aem-GridColumn--default--12:not(.cmp-teaser--card-v2):not(.cmp-teaser--card-v3):not(.cmp-list--teaser--stat)"],
        style: null,
        blocks: ["cards-reports"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
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
            section: blockDef.section || null
          });
        });
      });
    });
    pageBlocks.sort((a, b) => b.depth - a.depth);
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_home_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();
