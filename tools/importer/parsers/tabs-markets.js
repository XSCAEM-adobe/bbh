/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-markets. Base: tabs (container block, xwalk).
 * Source: https://www.bbh.com/us/en/insights/investor-services-insights/destination-distribution-navigating-the-worlds-fund-distribution-markets.html
 *   (.cmp-tabs--horizontal)
 * Container block: each tab = one row of 2 cells:
 *   cell 1 = tab name (field:name -> collapses; child model "tabs-markets-item")
 *   cell 2 = panel content (field:content, richtext): headings, bold-lead-in
 *            paragraphs, bulleted lists, an embedded video, italic footnotes.
 * The tab-item child model exposes `name` and `content`. Per hinting rules the
 * `name` field ends with no collapsing suffix, so BOTH cells carry field hints.
 * Brightcove videos inside a panel are emitted as a carrier <a href> to the
 * player URL so the embed-video auto-block can render them (video not dropped).
 * Generated: 2026-09-15
 */
export default function parse(element, { document }) {
  // Tab labels: the interactive tab <li>s (exclude prev/next action buttons and
  // the mobile-nav carousel indicators).
  const tabLabels = Array.from(element.querySelectorAll(':scope .cmp-tabs__tablist > li.cmp-tabs__tab'))
    .map((li) => li.textContent.replace(/\s+/g, ' ').trim());

  // Tab panels: one content container per tab.
  const panels = Array.from(element.querySelectorAll(':scope .cmp-tabs__tabpanel'));

  if (!panels.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  panels.forEach((panel, i) => {
    // Cell 1: tab name (field:name).
    const nameCell = document.createDocumentFragment();
    nameCell.appendChild(document.createComment(' field:name '));
    const label = tabLabels[i] || `Tab ${i + 1}`;
    const p = document.createElement('p');
    p.textContent = label;
    nameCell.appendChild(p);

    // Cell 2: panel content (field:content) as rich text.
    const contentCell = document.createDocumentFragment();
    contentCell.appendChild(document.createComment(' field:content '));

    // Replace each Brightcove video iframe with a carrier <a href> to the
    // player URL so the embed auto-block can rebuild the embed.
    const clone = panel.cloneNode(true);
    clone.querySelectorAll('iframe[src*="players.brightcove.net"], .cmp-video__brightcove iframe').forEach((iframe) => {
      const src = iframe.getAttribute('src');
      const videoWrap = iframe.closest('.cmp-video, .video, .cmp-wraptext-video') || iframe.parentElement;
      if (src) {
        const a = document.createElement('a');
        a.href = src;
        a.textContent = src;
        const wrapper = document.createElement('p');
        wrapper.appendChild(a);
        (videoWrap || iframe).replaceWith(wrapper);
      }
    });

    // Pull the meaningful content nodes (headings, paragraphs, lists) in order.
    const contentNodes = Array.from(clone.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol'))
      // Skip empty paragraphs and any list that is a tabs control artifact.
      .filter((n) => !n.closest('.cmp-tabs__tablist') && !n.closest('.cmp-tabs__mobile-nav'))
      .filter((n) => n.textContent.replace(/\s+/g, ' ').trim() || n.querySelector('a, img'));

    contentNodes.forEach((n) => contentCell.appendChild(n));

    cells.push([nameCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-markets', cells });
  element.replaceWith(block);
}
