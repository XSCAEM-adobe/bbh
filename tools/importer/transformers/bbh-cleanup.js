/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: BBH site-wide cleanup.
 *
 * Removes non-authorable site shell/chrome so the import contains only
 * page-level authorable content. Every selector below was verified against
 * migration-work/cleaned.html for the BBH source site.
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Overlays / modals / consent that would otherwise interfere with block
    // parsing. Verified in cleaned.html:
    //   #onetrust-consent-sdk / #onetrust-banner-sdk  -> cookie consent (line ~2153)
    //   .cmp-modal (incl. #acceptCountryWarning, #cage-captcha-modal,
    //     #luxfundsdisclaimermodal1, .cmp-lux-modal) -> disclaimers/captcha (line ~1942+)
    //   .cmp-alert / .alert -> site legal alert banner (line ~6, ~1776)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '.cmp-modal',
      '.cmp-alert',
      '.alert',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Convert pull-quote <blockquote> elements into the `quote` block. md2jcr
    // does not support the raw <blockquote> element, so any that survive as
    // default content break the import. The quote block is a 1-column block:
    //   row 1 = quotation, row 2 (optional) = attribution.
    element.querySelectorAll('blockquote').forEach((bq) => {
      // Collect quote text (drop stray straight-quote-only paragraphs the CMS
      // emits as decorative open/close quote marks) and an optional citation.
      const cite = bq.querySelector('cite, footer');
      const paras = [...bq.querySelectorAll('p')].filter((p) => {
        const txt = p.textContent.replace(/\s+/g, ' ').trim();
        return txt && txt !== '"' && txt !== '“' && txt !== '”';
      });

      const quoteP = document.createElement('p');
      quoteP.textContent = paras
        .map((p) => p.textContent.replace(/\s+/g, ' ').trim())
        .join(' ')
        .replace(/^["“”]+|["“”]+$/g, '')
        .trim();

      if (!quoteP.textContent) {
        bq.remove();
        return;
      }

      const rows = [[quoteP]];
      if (cite) {
        const citeText = cite.textContent.replace(/\s+/g, ' ').trim();
        if (citeText) {
          const authorP = document.createElement('p');
          authorP.textContent = citeText;
          rows.push([authorP]);
        }
      }

      const block = WebImporter.Blocks.createBlock(document, { name: 'quote', cells: rows });
      bq.replaceWith(block);
    });

    // Non-authorable global chrome. Verified in cleaned.html:
    //   header#accessHeader.bbh-header (line ~55), footer#accessFooter.bbh-footer (line ~1784)
    //   nav.bbh-header__nav / nav.bbh-footer__nav
    //   .bbh-header__accessible-container + .skip-to-content -> a11y skip links (line ~31+)
    //   #absoluteTop / #absoluteBottom (line ~2,4)
    //   #curtain -> nav overlay backdrop (line ~836)
    //   form#searchFrm.bbh-header__search-form -> header search (line ~805)
    //   div.breadcrumb -> empty, auto-populated breadcrumb container. On the
    //     investor-services-insights article it sits between the hero and the
    //     social-share section as an empty <div class="breadcrumb ..."></div>
    //     (cleaned.html line ~899). Non-authorable site chrome, additive and
    //     safe site-wide (breadcrumbs are never authored content).
    // NOTE: #theMatrix is intentionally NOT removed — it wraps header, main,
    // footer AND all authorable content (verified in cleaned.html: opens ~line 30,
    // closes ~line 2146). Removing it would delete the entire page.
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'nav',
      '.bbh-header__accessible-container',
      '.skip-to-content',
      '#absoluteTop',
      '#absoluteBottom',
      '#curtain',
      '.bbh-header__search-form',
      '.breadcrumb',
      'form',
      'input',
      'iframe',
      'noscript',
      'script',
      'style',
      'link',
    ]);

    // Strip non-authorable inline attributes left on surviving elements.
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('onclick');
      el.removeAttribute('data-track');
      el.removeAttribute('data-cmp-data-layer');
    });
  }
}
