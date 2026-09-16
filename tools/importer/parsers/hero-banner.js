/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero (block model, xwalk).
 * Source: https://www.bbh.com/us/en.html (.cmp-teaser--hero-page-v2)
 * Model fields: image (richtext), imageAlt (collapsed), text (richtext).
 * Library: 1 column, rows = [name], [background image], [text].
 * Generated: 2026-09-11
 */
export default function parse(element, { document }) {
  // Hero's own background image (nested business-line teasers have no image)
  const img = element.querySelector('.cmp-teaser__image img, img.cmp-image__image');
  // Hero title is an h1 in the title-wrapper; business lines use h2 (excluded)
  const heading = element.querySelector('.cmp-teaser__title-wrapper h1, .cmp-teaser__title-wrapper h2, h1.cmp-teaser__title');

  if (!img && !heading) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row: background image (field:image)
  if (img) {
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    imageCell.appendChild(img);
    cells.push([imageCell]);
  }

  // Row: text content — title (styled as heading) (field:text)
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));
  if (heading) textCell.appendChild(heading);
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
