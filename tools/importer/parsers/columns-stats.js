/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-stats. Base: columns (core columns block, xwalk, 4 columns).
 * Source: https://www.bbh.com/us/en.html (.cmp-list--teaser--stat.cmp-list--four-column)
 * Columns block: NO field hints. Each stat teaser becomes one column cell.
 * Library: row 1 = block name; row 2 = N columns (one per stat).
 * Generated: 2026-09-11
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll(':scope li.cmp-list__item'));

  if (!items.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const columnCells = items.map((item) => {
    const cell = [];
    const title = item.querySelector('.cmp-teaser__title');
    const desc = item.querySelector('.cmp-teaser__description');
    if (title) cell.push(title);
    if (desc) cell.push(desc);
    return cell;
  });

  // Single content row, one cell per stat (columns block => no hints)
  const cells = [columnCells];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-stats', cells });
  element.replaceWith(block);
}
