/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-statement. Base: columns (core columns block, xwalk).
 * Source: https://www.bbh.com/us/en.html (.cmp-teaser--card-v2.bbh-container-background__red)
 * Columns block: NO field hints. Each teaser list item becomes one column cell.
 * Library: row 1 = block name; row 2 = N columns.
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

  // Single content row, one cell per statement column (columns block => no hints)
  const cells = [columnCells];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-statement', cells });
  element.replaceWith(block);
}
