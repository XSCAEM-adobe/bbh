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

  // tools/importer/import-investor-services-insights.js
  var import_investor_services_insights_exports = {};
  __export(import_investor_services_insights_exports, {
    default: () => import_investor_services_insights_default
  });

  // tools/importer/parsers/hero-article.js
  function parse(element, { document: document2 }) {
    const img = element.querySelector(".cmp-teaser__image img.cmp-image__image, .cmp-teaser__image img");
    const eyebrow = element.querySelector(".cmp-teaser__lobs");
    const title = element.querySelector(".cmp-teaser__title, h1");
    const date = element.querySelector(".cmp-teaser__tout-date");
    const author = element.querySelector(".cmp-teaser__authors");
    const summary = element.querySelector(".cmp-teaser__description");
    if (!title && !img) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    const imageCell = document2.createDocumentFragment();
    imageCell.appendChild(document2.createComment(" field:image "));
    if (img) imageCell.appendChild(img);
    cells.push([imageCell]);
    const textCell = document2.createDocumentFragment();
    textCell.appendChild(document2.createComment(" field:text "));
    if (eyebrow) {
      const eyebrowText = eyebrow.textContent.replace(/\s+/g, " ").trim();
      if (eyebrowText) {
        const p = document2.createElement("p");
        p.textContent = eyebrowText;
        textCell.appendChild(p);
      }
    }
    if (title) {
      const h = document2.createElement("h1");
      h.textContent = title.textContent.replace(/\s+/g, " ").trim();
      textCell.appendChild(h);
    }
    if (date) {
      const p = document2.createElement("p");
      p.textContent = date.textContent.replace(/\s+/g, " ").trim();
      textCell.appendChild(p);
    }
    if (author) {
      const authorText = author.textContent.replace(/\s+/g, " ").trim();
      if (authorText) {
        const p = document2.createElement("p");
        p.textContent = authorText;
        textCell.appendChild(p);
      }
    }
    if (summary) {
      const p = document2.createElement("p");
      p.textContent = summary.textContent.replace(/\s+/g, " ").trim();
      textCell.appendChild(p);
    }
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/sharing-article.js
  function parse2(element, { document: document2 }) {
    const labelEl = Array.from(element.querySelectorAll("h1, h2, h3, h4, p, .cmp-sharing__label, .cmp-sharing-title")).find((el) => !el.closest("a") && el.textContent.replace(/\s+/g, " ").trim());
    const cells = [];
    if (labelEl && labelEl.textContent.replace(/\s+/g, " ").trim()) {
      const labelCell = document2.createDocumentFragment();
      labelCell.appendChild(document2.createComment(" field:text "));
      const p = document2.createElement("p");
      p.textContent = labelEl.textContent.replace(/\s+/g, " ").trim();
      labelCell.appendChild(p);
      cells.push([labelCell]);
    } else {
      cells.push([""]);
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "sharing-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-markets.js
  function parse3(element, { document: document2 }) {
    const tabLabels = Array.from(element.querySelectorAll(":scope .cmp-tabs__tablist > li.cmp-tabs__tab")).map((li) => li.textContent.replace(/\s+/g, " ").trim());
    const panels = Array.from(element.querySelectorAll(":scope .cmp-tabs__tabpanel"));
    if (!panels.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    panels.forEach((panel, i) => {
      const nameCell = document2.createDocumentFragment();
      nameCell.appendChild(document2.createComment(" field:name "));
      const label = tabLabels[i] || `Tab ${i + 1}`;
      const p = document2.createElement("p");
      p.textContent = label;
      nameCell.appendChild(p);
      const contentCell = document2.createDocumentFragment();
      contentCell.appendChild(document2.createComment(" field:content "));
      const clone = panel.cloneNode(true);
      clone.querySelectorAll('iframe[src*="players.brightcove.net"], .cmp-video__brightcove iframe').forEach((iframe) => {
        const src = iframe.getAttribute("src");
        const videoWrap = iframe.closest(".cmp-video, .video, .cmp-wraptext-video") || iframe.parentElement;
        if (src) {
          const a = document2.createElement("a");
          a.href = src;
          a.textContent = src;
          const wrapper = document2.createElement("p");
          wrapper.appendChild(a);
          (videoWrap || iframe).replaceWith(wrapper);
        }
      });
      const contentNodes = Array.from(clone.querySelectorAll("h1, h2, h3, h4, h5, h6, p, ul, ol")).filter((n) => !n.closest(".cmp-tabs__tablist") && !n.closest(".cmp-tabs__mobile-nav")).filter((n) => n.textContent.replace(/\s+/g, " ").trim() || n.querySelector("a, img"));
      contentNodes.forEach((n) => contentCell.appendChild(n));
      cells.push([nameCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-markets", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-up-next.js
  function parse4(element, { document: document2 }) {
    const img = element.querySelector(".cmp-teaser__image img.cmp-image__image, .cmp-teaser__image img");
    const eyebrow = element.querySelector(".cmp-teaser__up-next--desktop, .cmp-teaser__up-next");
    const title = element.querySelector(".cmp-teaser__title, h2, h3");
    const desc = element.querySelector(".cmp-teaser__description");
    const cta = element.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a");
    if (!title && !img) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const imageCell = document2.createDocumentFragment();
    imageCell.appendChild(document2.createComment(" field:image "));
    if (img) imageCell.appendChild(img);
    const textCell = document2.createDocumentFragment();
    textCell.appendChild(document2.createComment(" field:text "));
    if (eyebrow) {
      const p = document2.createElement("p");
      p.innerHTML = eyebrow.innerHTML.replace(/\s+/g, " ").trim();
      textCell.appendChild(p);
    }
    if (title) {
      const h = document2.createElement("h3");
      h.textContent = title.textContent.replace(/\s+/g, " ").trim();
      textCell.appendChild(h);
    }
    if (desc) {
      const p = document2.createElement("p");
      p.textContent = desc.textContent.replace(/\s+/g, " ").trim();
      textCell.appendChild(p);
    }
    if (cta) {
      const a = document2.createElement("a");
      a.href = cta.getAttribute("href");
      a.textContent = cta.textContent.replace(/\s+/g, " ").trim();
      const p = document2.createElement("p");
      p.appendChild(a);
      textCell.appendChild(p);
    }
    const cells = [[imageCell, textCell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-up-next", cells });
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

  // tools/importer/import-investor-services-insights.js
  var parsers = {
    "hero-article": parse,
    "sharing-article": parse2,
    "tabs-markets": parse3,
    "cards-up-next": parse4
  };
  var PAGE_TEMPLATE = {
    name: "investor-services-insights",
    description: "BBH insights article: split article hero with metadata, social share row, market tabs with video + copy, Up Next recirculation card, legal disclaimer",
    urls: [
      "https://www.bbh.com/us/en/insights/investor-services-insights/destination-distribution-navigating-the-worlds-fund-distribution-markets.html"
    ],
    blocks: [
      {
        name: "hero-article",
        instances: [".cmp-teaser--up-next-v2"]
      },
      {
        name: "sharing-article",
        instances: [".cmp-sharing-left"]
      },
      {
        name: "tabs-markets",
        instances: [".cmp-tabs--horizontal"]
      },
      {
        name: "cards-up-next",
        instances: [".cmp-teaser--smaller-crop-v2"]
      }
    ],
    sections: [
      {
        id: "article-hero",
        name: "article-hero",
        selector: [".cmp-teaser--up-next-v2"],
        style: null,
        blocks: ["hero-article"],
        defaultContent: []
      },
      {
        id: "social-share",
        name: "social-share",
        selector: [".cmp-sharing-left"],
        style: null,
        blocks: ["sharing-article"],
        defaultContent: []
      },
      {
        id: "market-tabs",
        name: "market-tabs",
        selector: [".cmp-tabs--horizontal"],
        style: null,
        blocks: ["tabs-markets"],
        defaultContent: []
      },
      {
        id: "up-next",
        name: "up-next",
        selector: [".cmp-teaser--smaller-crop-v2"],
        style: null,
        blocks: ["cards-up-next"],
        defaultContent: []
      },
      {
        id: "disclaimer",
        name: "disclaimer",
        selector: [".bbh-text--disclaimer"],
        style: "grey",
        blocks: [],
        defaultContent: [".bbh-text--disclaimer"]
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
  var import_investor_services_insights_default = {
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
  return __toCommonJS(import_investor_services_insights_exports);
})();
