/**
 * hero-article — article header: split layout with a photographic image on one
 * side and a content panel (eyebrow, title, date, author, summary) on the other.
 * Base: hero. Content-first — the block reads the authored cells, tags them so
 * CSS can lay out the two panels, and orders them to match the source design
 * (title, date, author, line-of-business eyebrow, summary). It invents no copy.
 */
export default function decorate(block) {
  const rows = [...block.children];
  // Row 1 = image cell, remaining rows = content (eyebrow/title/date/author/summary).
  const [imageRow, ...contentRows] = rows;

  if (imageRow) {
    imageRow.classList.add('hero-article-media');
  }

  const content = document.createElement('div');
  content.className = 'hero-article-content';
  contentRows.forEach((row) => content.append(...row.childNodes));
  contentRows.forEach((row) => row.remove());

  // The authored cell nests everything inside a single wrapper div; use it as
  // the host so the panel children can be reordered directly.
  const host = content.querySelector(':scope > div') || content;

  const title = host.querySelector('h1');
  const paras = [...host.querySelectorAll(':scope > p')];

  // Paragraphs are authored in order: eyebrow, date, author, summary.
  // (The summary is the last paragraph; it is the longest, so identify it that
  // way to stay robust if an optional paragraph is missing.)
  const summary = paras.length
    ? paras.reduce((a, b) => (b.textContent.trim().length > a.textContent.trim().length ? b : a))
    : null;
  const rest = paras.filter((p) => p !== summary);
  const [eyebrow, date, authorP] = rest;

  if (eyebrow) eyebrow.classList.add('hero-article-eyebrow');
  if (date) date.classList.add('hero-article-date');
  if (authorP) authorP.classList.add('hero-article-author');
  if (summary) summary.classList.add('hero-article-summary');

  // Reorder to match the source layout: title, date, author, eyebrow, summary.
  [title, date, authorP, eyebrow, summary]
    .filter(Boolean)
    .forEach((el) => host.append(el));

  if (imageRow) imageRow.after(content);
}
