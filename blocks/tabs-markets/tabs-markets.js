// eslint-disable-next-line import/no-unresolved
import { toClassName, decorateBlock, loadBlock } from '../../scripts/aem.js';

/**
 * tabs-markets — a horizontal tab switcher for market panels (e.g. Spain,
 * Singapore, UAE, Germany). Each authored row is one tab: its first cell is the
 * tab label, the row becomes the panel. Forked from the base `tabs` block.
 */
export default async function decorate(block) {
  const tablist = document.createElement('div');
  tablist.className = 'tabs-markets-list';
  tablist.setAttribute('role', 'tablist');

  const tabs = [...block.children].map((child) => child.firstElementChild);
  tabs.forEach((tab, i) => {
    const id = toClassName(tab.textContent);

    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-markets-panel';
    tabpanel.id = `tabs-markets-panel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tabs-markets-tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    const button = document.createElement('button');
    button.className = 'tabs-markets-tab';
    button.id = `tabs-markets-tab-${id}`;
    button.innerHTML = tab.innerHTML;
    button.setAttribute('aria-controls', `tabs-markets-panel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);
    tab.remove();
  });

  block.prepend(tablist);

  // Nested blocks inside panels (e.g. embed-video carrier links auto-blocked in
  // scripts.js) are not top-level, so the page's decorateBlocks/loadBlocks never
  // reach them. Decorate and load any that the page pipeline missed (no
  // data-block-status yet) so their JS/CSS runs. Known nested block variants:
  const NESTED_BLOCKS = ['embed-video'];
  block.querySelectorAll('.tabs-markets-panel').forEach((panel) => {
    NESTED_BLOCKS.forEach((name) => {
      panel.querySelectorAll(`.${name}:not([data-block-status])`).forEach((nested) => {
        decorateBlock(nested);
        loadBlock(nested);
      });
    });
  });
}
