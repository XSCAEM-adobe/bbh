/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-article. Base: hero (simple block, xwalk).
 * Source: https://www.bbh.com/us/en/insights/investor-services-insights/destination-distribution-navigating-the-worlds-fund-distribution-markets.html
 *   (.cmp-teaser--up-next-v2)
 * Split article hero. Model fields:
 *   image (reference) -> field:image  (imageAlt collapses into <img alt>)
 *   text  (richtext)  -> field:text
 * Simple block: 1 column. Row 2 = image cell; Row 3 = text cell holding the
 * line-of-business eyebrow, article title (h1), publish date, author
 * (portrait + name) and the summary paragraph as rich text.
 * Generated: 2026-09-15
 */
export default function parse(element, { document }) {
  // Hero image lives directly under .cmp-teaser__image (NOT the author portrait,
  // which sits inside .cmp-teaser__author-img).
  const img = element.querySelector('.cmp-teaser__image img.cmp-image__image, .cmp-teaser__image img');

  const eyebrow = element.querySelector('.cmp-teaser__lobs');
  const title = element.querySelector('.cmp-teaser__title, h1');
  const date = element.querySelector('.cmp-teaser__tout-date');
  const author = element.querySelector('.cmp-teaser__authors');
  const summary = element.querySelector('.cmp-teaser__description');

  if (!title && !img) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row: image (field:image) — keep the cell even when empty.
  const imageCell = document.createDocumentFragment();
  imageCell.appendChild(document.createComment(' field:image '));
  if (img) imageCell.appendChild(img);
  cells.push([imageCell]);

  // Row: text (field:text) — eyebrow, title, date, author, summary as richtext.
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));

  // Eyebrow (line of business), e.g. "Investor Services".
  if (eyebrow) {
    const eyebrowText = eyebrow.textContent.replace(/\s+/g, ' ').trim();
    if (eyebrowText) {
      const p = document.createElement('p');
      p.textContent = eyebrowText;
      textCell.appendChild(p);
    }
  }

  // Article title as a heading.
  if (title) {
    const h = document.createElement('h1');
    h.textContent = title.textContent.replace(/\s+/g, ' ').trim();
    textCell.appendChild(h);
  }

  // Publish date.
  if (date) {
    const p = document.createElement('p');
    p.textContent = date.textContent.replace(/\s+/g, ' ').trim();
    textCell.appendChild(p);
  }

  // Author name — keep as a text paragraph. Drop the inline portrait image:
  // an <img> embedded inside the richtext field breaks md2jcr row/column
  // mapping, and the hero design does not render a portrait.
  if (author) {
    const authorText = author.textContent.replace(/\s+/g, ' ').trim();
    if (authorText) {
      const p = document.createElement('p');
      p.textContent = authorText;
      textCell.appendChild(p);
    }
  }

  // Summary paragraph.
  if (summary) {
    const p = document.createElement('p');
    p.textContent = summary.textContent.replace(/\s+/g, ' ').trim();
    textCell.appendChild(p);
  }

  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-article', cells });
  element.replaceWith(block);
}
