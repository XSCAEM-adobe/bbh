/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-up-next. Base: cards (container block, xwalk).
 * Source: https://www.bbh.com/us/en/insights/investor-services-insights/destination-distribution-navigating-the-worlds-fund-distribution-markets.html
 *   (.cmp-teaser--smaller-crop-v2)
 * Container block: a single "Up Next" recirculation card = one row of 2 cells:
 *   cell 1 = image (field:image)  (imageAlt collapses into <img alt>)
 *   cell 2 = text (field:text): eyebrow ("Up Next") + article heading +
 *            description + "Read It" CTA link, as rich text.
 * An image or text cell may be empty but must still exist.
 * Generated: 2026-09-15
 */
export default function parse(element, { document }) {
  const img = element.querySelector('.cmp-teaser__image img.cmp-image__image, .cmp-teaser__image img');
  const eyebrow = element.querySelector('.cmp-teaser__up-next--desktop, .cmp-teaser__up-next');
  const title = element.querySelector('.cmp-teaser__title, h2, h3');
  const desc = element.querySelector('.cmp-teaser__description');
  const cta = element.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a');

  if (!title && !img) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Cell 1: image (field:image) — keep the cell even if empty.
  const imageCell = document.createDocumentFragment();
  imageCell.appendChild(document.createComment(' field:image '));
  if (img) imageCell.appendChild(img);

  // Cell 2: text (field:text) — eyebrow + heading + description + CTA.
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));

  if (eyebrow) {
    const p = document.createElement('p');
    // Preserve inline emphasis (e.g. "Up <em>Next</em>").
    p.innerHTML = eyebrow.innerHTML.replace(/\s+/g, ' ').trim();
    textCell.appendChild(p);
  }
  if (title) {
    const h = document.createElement('h3');
    h.textContent = title.textContent.replace(/\s+/g, ' ').trim();
    textCell.appendChild(h);
  }
  if (desc) {
    const p = document.createElement('p');
    p.textContent = desc.textContent.replace(/\s+/g, ' ').trim();
    textCell.appendChild(p);
  }
  if (cta) {
    const a = document.createElement('a');
    a.href = cta.getAttribute('href');
    a.textContent = cta.textContent.replace(/\s+/g, ' ').trim();
    const p = document.createElement('p');
    p.appendChild(a);
    textCell.appendChild(p);
  }

  const cells = [[imageCell, textCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-up-next', cells });
  element.replaceWith(block);
}
