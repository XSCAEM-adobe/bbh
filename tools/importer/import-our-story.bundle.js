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

  // tools/importer/import-our-story.js
  var import_our_story_exports = {};
  __export(import_our_story_exports, {
    default: () => import_our_story_default
  });

  // tools/importer/parsers/breadcrumb.js
  function parse(element, { document: document2 }) {
    const list = element.querySelector(".cmp-breadcrumb__list");
    if (!list) {
      element.remove();
      return;
    }
    const seen = /* @__PURE__ */ new Set();
    const anchors = [];
    list.querySelectorAll(":scope > li").forEach((li) => {
      const a = li.querySelector(":scope > a, a");
      if (!a) return;
      const text = a.textContent.replace(/\s+/g, " ").trim();
      const href = a.getAttribute("href");
      if (!text || !href || seen.has(href)) return;
      seen.add(href);
      const link = document2.createElement("a");
      link.href = href;
      link.textContent = text;
      anchors.push(link);
    });
    if (!anchors.length) {
      element.remove();
      return;
    }
    const cell = document2.createElement("p");
    anchors.forEach((a, i) => {
      if (i > 0) cell.append(" ");
      cell.append(a);
    });
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "breadcrumb",
      cells: [[cell]]
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-report-download.js
  function parse2(element, { document: document2 }) {
    const cover = element.querySelector('.cmp-print_thumbnail, img[class*="thumbnail"]');
    const summary = element.querySelector('.cmp-print_summary, [class*="summary"]');
    const cell2 = [];
    if (summary) {
      const boldLabels = Array.from(summary.querySelectorAll("b, strong"));
      const tocLabel = boldLabels.find((b) => /table of contents/i.test(b.textContent || ""));
      if (tocLabel) {
        const heading = document2.createElement("h3");
        heading.textContent = tocLabel.textContent.trim();
        const wrapper = tocLabel.parentElement;
        if (wrapper && wrapper !== summary && (wrapper.textContent || "").trim() === (tocLabel.textContent || "").trim()) {
          wrapper.replaceWith(heading);
        } else {
          tocLabel.replaceWith(heading);
        }
      }
      Array.from(summary.childNodes).forEach((node) => cell2.push(node));
    }
    const downloadSrc = element.querySelector('.cmp-print_downloadButton, a[class*="downloadButton"], a[href$=".pdf"]');
    if (downloadSrc) {
      const dl = document2.createElement("a");
      dl.setAttribute("href", downloadSrc.getAttribute("href") || "#");
      dl.textContent = "Download";
      cell2.push(dl);
    }
    const printSrc = element.querySelector('.cmp-print_printButton, a[class*="printButton"]');
    if (printSrc) {
      const pr = document2.createElement("a");
      const printHref = printSrc.getAttribute("href") || "";
      pr.setAttribute("href", printHref && !/^javascript:/i.test(printHref) ? printHref : "#");
      pr.textContent = "Print";
      cell2.push(pr);
    }
    if (!cover && !cell2.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cell1 = cover ? [cover] : [""];
    const cells = [[cell1, cell2]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-report-download", cells });
    element.replaceWith(block);
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
      element.querySelectorAll("blockquote").forEach((bq) => {
        const cite = bq.querySelector("cite, footer");
        const paras = [...bq.querySelectorAll("p")].filter((p) => {
          const txt = p.textContent.replace(/\s+/g, " ").trim();
          return txt && txt !== '"' && txt !== "\u201C" && txt !== "\u201D";
        });
        const quoteP = document.createElement("p");
        quoteP.textContent = paras.map((p) => p.textContent.replace(/\s+/g, " ").trim()).join(" ").replace(/^["“”]+|["“”]+$/g, "").trim();
        if (!quoteP.textContent) {
          bq.remove();
          return;
        }
        const rows = [[quoteP]];
        if (cite) {
          const citeText = cite.textContent.replace(/\s+/g, " ").trim();
          if (citeText) {
            const authorP = document.createElement("p");
            authorP.textContent = citeText;
            rows.push([authorP]);
          }
        }
        const block = WebImporter.Blocks.createBlock(document, { name: "quote", cells: rows });
        bq.replaceWith(block);
      });
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
        ".breadcrumb",
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

  // tools/importer/import-our-story.js
  var parsers = {
    breadcrumb: parse,
    "columns-report-download": parse2
  };
  var PAGE_TEMPLATE = {
    name: "our-story",
    description: "BBH 2025 Annual Report landing page: red title band + report download feature (cover image, intro, table of contents, Download/Print CTAs)",
    urls: [
      "https://www.bbh.com/us/en/bbh-who-we-are/our-story/2025-annual-report.html"
    ],
    blocks: [
      {
        name: "breadcrumb",
        instances: [".breadcrumb"]
      },
      {
        name: "columns-report-download",
        instances: [".cmp-print"]
      }
    ],
    sections: [
      {
        id: "page-title",
        name: "page-title",
        selector: [".cmp-teaser--red-ribbon-only-text"],
        style: "deep-red",
        blocks: [],
        defaultContent: [".cmp-teaser--red-ribbon-only-text"]
      },
      {
        id: "breadcrumb",
        name: "breadcrumb",
        selector: [".breadcrumb"],
        style: null,
        blocks: ["breadcrumb"],
        defaultContent: []
      },
      {
        id: "report-download",
        name: "report-download",
        selector: [".cmp-print"],
        style: null,
        blocks: ["columns-report-download"],
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
  var import_our_story_default = {
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
  return __toCommonJS(import_our_story_exports);
})();
