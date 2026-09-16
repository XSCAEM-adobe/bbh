// BBH footer — content-first: reads content/footer.plain.html and renders the
// red-band footer (4 disclosure link columns, Contact Us + social, logo + copyright).

/**
 * Fetch the footer fragment. Metadata-independent dual-fetch:
 *  1. /content/footer.plain.html (localhost / aem up)
 *  2. /footer.plain.html (DA/EDS production — served at site root)
 * Rewrites relative image paths to resolve against the fragment location.
 */
async function fetchFooter() {
  // Local (aem up) serves the fragment under /content/; DA/EDS serves it at the
  // site root. Track which path resolved so image srcs resolve against it.
  let fragmentPath = '/content/footer.plain.html';
  let resp = await fetch(fragmentPath);
  if (!resp.ok) {
    fragmentPath = '/footer.plain.html';
    resp = await fetch(fragmentPath);
  }
  if (!resp.ok) return null;
  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  // Resolve relative image srcs (e.g. DA's "./media_<hash>.ext") against the
  // fragment location, not the page URL, so they point at the right path.
  const fragmentUrl = new URL(fragmentPath, window.location.origin);
  tmp.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src');
    if (src && !/^(https?:)?\/\//.test(src) && !src.startsWith('data:')) {
      const resolved = new URL(src, fragmentUrl);
      img.setAttribute('src', resolved.pathname + resolved.search);
    }
  });
  return tmp;
}

export default async function decorate(block) {
  const fragment = await fetchFooter();
  block.textContent = '';
  if (!fragment) return;

  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Label the three top-level sections.
  ['links', 'connect', 'bottom'].forEach((c, i) => {
    if (footer.children[i]) footer.children[i].classList.add(`footer-${c}`);
  });

  // Link columns: first <li> in each list is the column heading.
  const linksSection = footer.querySelector('.footer-links');
  if (linksSection) {
    linksSection.querySelectorAll(':scope > ul').forEach((ul) => {
      ul.classList.add('footer-col');
      const first = ul.querySelector(':scope > li');
      if (first) first.classList.add('footer-col-heading');
    });
  }

  // Connect section: contact list + social list.
  const connect = footer.querySelector('.footer-connect');
  if (connect) {
    const lists = connect.querySelectorAll(':scope > ul');
    if (lists[0]) lists[0].classList.add('footer-contact');
    if (lists[1]) {
      lists[1].classList.add('footer-social');
      // Social links open in a new tab.
      lists[1].querySelectorAll('a').forEach((a) => {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener');
      });
    }
  }

  block.append(footer);
}
