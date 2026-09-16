/**
 * breadcrumb — trail of links to ancestor pages, shown in a white strip below
 * the page title band (matches bbh.com). Content-first: the block holds one
 * authored list of links; this reads them and renders an accessible nav with a
 * caret separator before each crumb. It invents no copy.
 */
export default function decorate(block) {
  const links = [...block.querySelectorAll('a')];

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');

  const ol = document.createElement('ol');
  ol.className = 'breadcrumb-list';

  links.forEach((a) => {
    const li = document.createElement('li');
    li.className = 'breadcrumb-item';
    const link = document.createElement('a');
    link.href = a.getAttribute('href') || '#';
    link.textContent = a.textContent.replace(/\s+/g, ' ').trim();
    li.append(link);
    ol.append(li);
  });

  nav.append(ol);
  block.replaceChildren(nav);
}
