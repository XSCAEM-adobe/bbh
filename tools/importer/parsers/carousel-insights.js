/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-insights. Base: carousel (container block, xwalk).
 * Source: https://www.bbh.com/us/en.html (.cmp-teaser--card-v3 .cmp-list__list-container)
 * Container block: each slide = one row. Item model fields:
 *   image (reference) -> field:image, imageAlt (collapsed onto img), text (richtext) -> field:text.
 * Library carousel row: [image cell][text cell].
 * NOTE: slick duplicates slides (slick-cloned); dedupe by title link href.
 * Generated: 2026-09-11
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('li.cmp-list__item'));

  const seen = new Set();
  const cells = [];

  items.forEach((item) => {
    const titleLink = item.querySelector('.cmp-teaser__title-link, .cmp-teaser__title a');
    const key = titleLink ? titleLink.getAttribute('href') : null;
    // Dedupe slick clones; skip items with no identifying link/content
    if (key) {
      if (seen.has(key)) return;
      seen.add(key);
    }

    const img = item.querySelector('.cmp-teaser__image img, img.cmp-image__image');
    const title = item.querySelector('.cmp-teaser__title');
    const cta = item.querySelector('.cmp-teaser__action-link, a[class*="action-link"]');

    if (!img && !title) return;

    // Cell 1: image (field:image)
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (img) imageCell.appendChild(img);

    // Cell 2: text (title + optional CTA) (field:text)
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    if (title) textCell.appendChild(title);
    if (cta) textCell.appendChild(cta);

    cells.push([imageCell, textCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-insights', cells });
  element.replaceWith(block);
}
