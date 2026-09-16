/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-reports. Base: cards (container block, xwalk).
 * Source: https://www.bbh.com/us/en.html
 *   (.cmp-teaser--card.top.list...:not(v2):not(v3):not(stat))
 * Container block: each card = one row. Item ("card") model fields:
 *   image (reference) -> field:image, text (richtext) -> field:text.
 * Library cards row: [image cell][text cell]; an empty image/text cell must still exist.
 * A section title heading (e.g. "Stakeholder Reports") lives inside the source
 * element but outside the card <li> items; it is preserved as default content
 * before the block so authors keep the section heading.
 * Generated: 2026-09-11
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('li.cmp-list__item'));

  if (!items.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Section title: a heading inside the source element but not within a card item.
  const sectionTitle = Array.from(element.querySelectorAll('h1, h2, h3'))
    .find((h) => !h.closest('li.cmp-list__item'));

  const cells = [];

  items.forEach((item) => {
    const img = item.querySelector('.cmp-teaser__image img, img.cmp-image__image');
    // Title is a linked heading (report title -> report page)
    const title = item.querySelector('.cmp-teaser__title-wrapper h2, .cmp-teaser__title');
    const desc = item.querySelector('.cmp-teaser__description');

    if (!img && !title) return;

    // Cell 1: image (field:image) — keep the cell even if empty
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (img) imageCell.appendChild(img);

    // Cell 2: text (title + optional description) (field:text)
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    if (title) textCell.appendChild(title);
    if (desc) textCell.appendChild(desc);

    cells.push([imageCell, textCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-reports', cells });

  // Preserve the section heading as default content before the block.
  if (sectionTitle) {
    const heading = document.createElement(sectionTitle.tagName.toLowerCase());
    heading.textContent = sectionTitle.textContent.trim();
    element.replaceWith(heading, block);
  } else {
    element.replaceWith(block);
  }
}
