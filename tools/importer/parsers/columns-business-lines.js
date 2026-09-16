/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-business-lines. Base: columns (core columns block, xwalk).
 * Source: https://www.bbh.com/us/en.html (.cmp-teaser--hero-page-v2 .cmp-list__list-container)
 * Columns block: NO field hints. Each list item becomes one column cell.
 * Library: row 1 = block name; row 2 = N columns (one per business line).
 * Generated: 2026-09-11
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll(':scope > ul > li.cmp-list__item, :scope li.cmp-list__item'));

  if (!items.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const columnCells = items.map((item) => {
    const cell = [];
    const title = item.querySelector('.cmp-teaser__title');
    const desc = item.querySelector('.cmp-teaser__description');
    const cta = item.querySelector('.cmp-teaser__action-link, a[class*="action-link"]');
    if (title) cell.push(title);
    if (desc) cell.push(desc);
    if (cta) cell.push(cta);
    return cell;
  });

  // Single content row with one cell per business line (columns block => no hints)
  const cells = [columnCells];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-business-lines', cells });

  // These panels are nested inside the hero container (.cmp-teaser--hero-page-v2),
  // which the hero-banner parser replaces wholesale. Relocate this block to a
  // sibling AFTER the hero container so it survives the hero replacement and
  // renders as the next block in the hero section. Falls back to in-place swap.
  const heroAncestor = element.closest('.cmp-teaser--hero-page-v2');
  if (heroAncestor && heroAncestor.parentNode) {
    heroAncestor.after(block);
    element.remove();
  } else {
    element.replaceWith(block);
  }
}
