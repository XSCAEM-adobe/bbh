/* eslint-disable */
/* global WebImporter */
/**
 * Parser for embed-video. Base: embed (simple block, xwalk).
 * Source: https://www.bbh.com/us/en/insights/investor-services-insights/destination-distribution-navigating-the-worlds-fund-distribution-markets.html
 *   (.cmp-video__brightcove — a Brightcove iframe, src players.brightcove.net/...)
 * Model fields:
 *   embed_placeholder (reference) -> field:embed_placeholder (optional poster image)
 *   embed_placeholderAlt          -> collapses into <img alt>
 *   embed_uri (text)              -> field:embed_uri (the video URL)
 * Library embed: 1 column. Optional poster image row above, then the URL row.
 * These are grouped fields (embed_ prefix) so they share one cell; the image
 * (if present) goes above the link per the library description.
 * The Brightcove player URL is emitted as an <a href> so the embed auto-block
 * can render the video.
 * Generated: 2026-09-15
 */
export default function parse(element, { document }) {
  const iframe = element.querySelector('iframe[src*="players.brightcove.net"], iframe[src]');
  const src = iframe ? iframe.getAttribute('src') : null;

  // Optional poster image (rare for Brightcove embeds).
  const poster = element.querySelector('img.cmp-image__image, .cmp-video__poster img, img');

  if (!src && !poster) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Grouped embed_ fields share one cell: poster image above the URL link.
  const cell = document.createDocumentFragment();

  if (poster) {
    cell.appendChild(document.createComment(' field:embed_placeholder '));
    cell.appendChild(poster);
  }

  if (src) {
    cell.appendChild(document.createComment(' field:embed_uri '));
    const a = document.createElement('a');
    a.href = src;
    a.textContent = src;
    cell.appendChild(a);
  }

  const cells = [[cell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-video', cells });
  element.replaceWith(block);
}
