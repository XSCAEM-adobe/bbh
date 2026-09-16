/* eslint-disable */
/* global WebImporter */
/**
 * Parser for sharing-article. Base: sharing (simple block, xwalk).
 * Source: https://www.bbh.com/us/en/insights/investor-services-insights/destination-distribution-navigating-the-worlds-fund-distribution-markets.html
 *   (.cmp-sharing-left)
 * Social share row. The share buttons (email/facebook/twitter/linkedin) are
 * generated client-side by the block JS from the page URL, so the parser only
 * emits the block with an optional label cell. Model field:
 *   text (richtext) -> field:text  (Label, usually empty)
 * Simple block: 1 column, 1 content row (the optional label). When no label is
 * present in source, the cell is left empty (no field hint on empty cells).
 * Generated: 2026-09-15
 */
export default function parse(element, { document }) {
  // Optional label: any visible heading/paragraph text that is NOT part of a
  // share button/link (the buttons only contain icon <img>s).
  const labelEl = Array.from(element.querySelectorAll('h1, h2, h3, h4, p, .cmp-sharing__label, .cmp-sharing-title'))
    .find((el) => !el.closest('a') && el.textContent.replace(/\s+/g, ' ').trim());

  const cells = [];

  if (labelEl && labelEl.textContent.replace(/\s+/g, ' ').trim()) {
    const labelCell = document.createDocumentFragment();
    labelCell.appendChild(document.createComment(' field:text '));
    const p = document.createElement('p');
    p.textContent = labelEl.textContent.replace(/\s+/g, ' ').trim();
    labelCell.appendChild(p);
    cells.push([labelCell]);
  } else {
    // Empty label cell — no field hint on empty cells per hinting rules.
    cells.push(['']);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'sharing-article', cells });
  element.replaceWith(block);
}
