/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-report-download. Base: columns (core columns block, xwalk).
 * Source: https://www.bbh.com/us/en/bbh-who-we-are/our-story/2025-annual-report.html (.cmp-print)
 * Columns block: NO field hints. Produces a single 2-cell columns row.
 *   Cell 1 = report cover image (.cmp-print_thumbnail).
 *   Cell 2 = intro summary paragraphs + "Table of Contents" heading + TOC list
 *            + Download CTA (real <a href="...pdf">) + Print CTA (label "Print").
 * Library: row 1 = block name; row 2 = N columns (here 2).
 * Generated: 2026-09-16
 */
export default function parse(element, { document }) {
  // --- Cell 1: cover image ---
  const cover = element.querySelector('.cmp-print_thumbnail, img[class*="thumbnail"]');

  // --- Cell 2: summary + TOC + CTAs ---
  const summary = element.querySelector('.cmp-print_summary, [class*="summary"]');
  const cell2 = [];

  if (summary) {
    // Upgrade the bold "Table of Contents" label into a real heading so it
    // survives as authorable content rather than inline emphasis.
    const boldLabels = Array.from(summary.querySelectorAll('b, strong'));
    const tocLabel = boldLabels.find((b) => /table of contents/i.test(b.textContent || ''));
    if (tocLabel) {
      const heading = document.createElement('h3');
      heading.textContent = tocLabel.textContent.trim();
      // Replace the wrapping element (usually a div holding only the <b>) if it
      // exists, otherwise replace the bold node itself.
      const wrapper = tocLabel.parentElement;
      if (wrapper && wrapper !== summary && (wrapper.textContent || '').trim() === (tocLabel.textContent || '').trim()) {
        wrapper.replaceWith(heading);
      } else {
        tocLabel.replaceWith(heading);
      }
    }

    // Keep the summary block content (intro paragraphs, TOC heading, TOC list).
    // Move its child nodes into the cell so we can append the CTAs alongside.
    Array.from(summary.childNodes).forEach((node) => cell2.push(node));
  }

  // Download CTA — preserve the real PDF href, clean label.
  const downloadSrc = element.querySelector('.cmp-print_downloadButton, a[class*="downloadButton"], a[href$=".pdf"]');
  if (downloadSrc) {
    const dl = document.createElement('a');
    dl.setAttribute('href', downloadSrc.getAttribute('href') || '#');
    dl.textContent = 'Download';
    cell2.push(dl);
  }

  // Print CTA — no real destination in source (javascript:void(0)); represent
  // as a link labeled "Print" so it survives as authorable content.
  const printSrc = element.querySelector('.cmp-print_printButton, a[class*="printButton"]');
  if (printSrc) {
    const pr = document.createElement('a');
    const printHref = printSrc.getAttribute('href') || '';
    pr.setAttribute('href', printHref && !/^javascript:/i.test(printHref) ? printHref : '#');
    pr.textContent = 'Print';
    cell2.push(pr);
  }

  // Empty-block guard
  if (!cover && !cell2.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cell1 = cover ? [cover] : [''];

  // Single content row, two columns (columns block => no field hints)
  const cells = [[cell1, cell2]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-report-download', cells });
  element.replaceWith(block);
}
