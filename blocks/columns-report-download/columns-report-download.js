/**
 * columns-report-download — a two-column report feature: report cover image on
 * one side, and on the other an intro summary, a "Table of Contents" heading +
 * list, and Download (PDF) / Print CTAs. Forked from the base `columns` block.
 */

const ICON_DOWNLOAD = '<svg class="report-cta-icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M10 2v9m0 0 4-4m-4 4L6 7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 14v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ICON_PRINT = '<svg class="report-cta-icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M6 8V3h8v5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><rect x="6" y="12" width="8" height="5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-report-download-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col, i) => {
      col.classList.add('columns-report-download-col');
      const pic = col.querySelector('picture');
      if (pic && col.children.length === 1 && col.querySelector(':scope > p')?.children.length === 1) {
        col.classList.add('columns-report-download-media');
      } else if (i === 0 && pic) {
        col.classList.add('columns-report-download-media');
      } else {
        col.classList.add('columns-report-download-body');
      }
    });
  });

  // Append trailing icons to the CTAs, matching the source (download / print).
  const body = block.querySelector('.columns-report-download-body');
  if (body) {
    body.querySelectorAll('a.button').forEach((a) => {
      const label = a.textContent.trim().toLowerCase();
      if (a.querySelector('.report-cta-icon')) return;
      if (label.includes('download') || a.hasAttribute('download') || (a.getAttribute('href') || '').toLowerCase().endsWith('.pdf')) {
        a.insertAdjacentHTML('beforeend', ICON_DOWNLOAD);
      } else if (label.includes('print')) {
        a.insertAdjacentHTML('beforeend', ICON_PRINT);
      }
    });
  }
}
