/* eslint-disable */
/* global WebImporter */
/**
 * Parser for breadcrumb. Source: .breadcrumb > nav.cmp-breadcrumb.
 * The source markup carries the visible crumb trail in .cmp-breadcrumb__list
 * (each <li> a level), plus hidden dropdown nav groups we ignore. We emit a
 * single-cell block holding one paragraph of anchor links, in order.
 * Generated: 2026-09-16
 */
export default function parse(element, { document }) {
  const list = element.querySelector('.cmp-breadcrumb__list');
  if (!list) {
    element.remove();
    return;
  }

  // One anchor per top-level crumb item; skip empty/duplicate hidden links.
  const seen = new Set();
  const anchors = [];
  list.querySelectorAll(':scope > li').forEach((li) => {
    const a = li.querySelector(':scope > a, a');
    if (!a) return;
    const text = a.textContent.replace(/\s+/g, ' ').trim();
    const href = a.getAttribute('href');
    if (!text || !href || seen.has(href)) return;
    seen.add(href);
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    anchors.push(link);
  });

  if (!anchors.length) {
    element.remove();
    return;
  }

  const cell = document.createElement('p');
  anchors.forEach((a, i) => {
    if (i > 0) cell.append(' ');
    cell.append(a);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'breadcrumb',
    cells: [[cell]],
  });
  element.replaceWith(block);
}
