// BBH header — content-first: reads nav.plain.html and builds a dark bar with
// click-triggered dropdown panels (Who We Are, What We Do), a client-access
// link and a search toggle. All copy/links/images live in content/nav.plain.html.

const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Fetch the nav fragment. Metadata-independent dual-fetch:
 *  1. /content/nav.plain.html (localhost / aem up)
 *  2. /nav.plain.html (DA/EDS production — served at site root)
 */
async function fetchNav() {
  let base = '/content/';
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) {
    base = '/';
    resp = await fetch('/nav.plain.html');
  }
  if (!resp.ok) return null;
  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  // Relative image paths in the fragment (e.g. "images/logo.svg") must resolve
  // against the fragment location, not the page URL. Rewrite to root-relative.
  tmp.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src');
    if (src && !/^(https?:)?\/\//.test(src) && !src.startsWith('/')) {
      img.setAttribute('src', base + src);
    }
  });
  return tmp;
}

/** Close every open dropdown in the given nav. */
function closeAllDropdowns(nav, except = null) {
  nav.querySelectorAll('.nav-drop[aria-expanded="true"]').forEach((li) => {
    if (li !== except) li.setAttribute('aria-expanded', 'false');
  });
}

function closeOnEscape(nav) {
  return (e) => {
    if (e.code === 'Escape') closeAllDropdowns(nav);
  };
}

export default async function decorate(block) {
  const fragment = await fetchNav();
  block.textContent = '';
  if (!fragment) return;

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main navigation');
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  // Label the three sections: brand, sections (nav), tools.
  ['brand', 'sections', 'tools'].forEach((c, i) => {
    if (nav.children[i]) nav.children[i].classList.add(`nav-${c}`);
  });

  const navSections = nav.querySelector('.nav-sections');

  // Mark top-level items that own a submenu, and wire click-to-toggle.
  if (navSections) {
    navSections.querySelectorAll(':scope > ul > li').forEach((li) => {
      const submenu = li.querySelector(':scope > ul');
      if (!submenu) return;
      li.classList.add('nav-drop');
      li.setAttribute('aria-expanded', 'false');

      // A toggle button separate from the label link, so the label can still navigate.
      const label = li.querySelector(':scope > a');
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'nav-drop-toggle';
      toggle.setAttribute('aria-label', `Toggle ${label ? label.textContent.trim() : 'menu'} submenu`);
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const open = li.getAttribute('aria-expanded') === 'true';
        closeAllDropdowns(nav, open ? null : li);
        li.setAttribute('aria-expanded', open ? 'false' : 'true');
      });
      li.insertBefore(toggle, submenu);

      // Nested (level-3) items: expandable in place.
      submenu.querySelectorAll(':scope > li').forEach((subLi) => {
        if (subLi.querySelector(':scope > ul')) subLi.classList.add('nav-subdrop');
      });
    });
  }

  // Tools: give the client-access link its icon treatment and add a search toggle.
  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    const search = document.createElement('button');
    search.type = 'button';
    search.className = 'nav-search-toggle';
    search.setAttribute('aria-label', 'Search');
    navTools.querySelector('ul')?.appendChild(
      (() => { const li = document.createElement('li'); li.className = 'nav-search'; li.append(search); return li; })(),
    );
  }

  // Hamburger for mobile.
  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';
  hamburger.innerHTML = '<button type="button" aria-controls="nav" aria-label="Open navigation" aria-expanded="false"><span class="nav-hamburger-icon"></span></button>';
  const hamburgerBtn = hamburger.querySelector('button');
  hamburgerBtn.addEventListener('click', () => {
    const open = nav.getAttribute('data-expanded') === 'true';
    nav.setAttribute('data-expanded', open ? 'false' : 'true');
    hamburgerBtn.setAttribute('aria-expanded', open ? 'false' : 'true');
    hamburgerBtn.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
    document.body.style.overflowY = open || isDesktop.matches ? '' : 'hidden';
  });
  nav.prepend(hamburger);
  nav.setAttribute('data-expanded', 'false');

  // Close dropdowns on outside click / escape.
  document.addEventListener('click', (e) => { if (!nav.contains(e.target)) closeAllDropdowns(nav); });
  window.addEventListener('keydown', closeOnEscape(nav));

  // Reset state when crossing the desktop/mobile breakpoint.
  isDesktop.addEventListener('change', () => {
    closeAllDropdowns(nav);
    nav.setAttribute('data-expanded', 'false');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.setAttribute('aria-label', 'Open navigation');
    document.body.style.overflowY = '';
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  // Scroll-reactive header (matches bbh.com): transparent while it floats over a
  // top-of-page hero, solid dark once scrolled. On pages without a leading hero
  // it stays solid and content is offset so it isn't hidden behind the fixed bar.
  // Only a full-bleed dark photographic hero (the home page) gets the
  // transparent header floating over it. The article split-hero (.hero-article)
  // starts BELOW a white header bar on the source, so it is NOT a top hero here.
  const firstSection = document.querySelector('main > .section');
  const hasTopHero = !!firstSection
    && (firstSection.classList.contains('dark')
      || firstSection.querySelector('.hero-banner, .hero'));

  // Pages with a leading hero: transparent over the image, dark once scrolled.
  // Pages without a hero: a white bar with dark text at rest, dark once scrolled
  // (matches bbh.com — e.g. the annual-report page). Both use the same scroll
  // toggle; only the resting appearance differs.
  const isLight = !hasTopHero;
  if (isLight) {
    navWrapper.classList.add('nav-light');
    document.body.classList.add('nav-has-offset');
  }

  // On the light (non-hero) bar the logo is dark-text at rest but must flip to
  // the white logo once the bar turns dark on scroll. The dark-text SVG keeps
  // the red/white flag; the white SVG is the default in nav.plain.html.
  const brandImg = nav.querySelector('.nav-brand img');
  const setLogo = (dark) => {
    if (!brandImg) return;
    const src = brandImg.getAttribute('src') || '';
    brandImg.setAttribute('src', dark
      ? src.replace(/bbh-header-logo\.svg$/, 'bbh-header-logo-dark.svg')
      : src.replace(/bbh-header-logo-dark\.svg$/, 'bbh-header-logo.svg'));
  };

  const onScroll = () => {
    const scrolled = window.scrollY > 80;
    navWrapper.classList.toggle('nav-scrolled', scrolled);
    // Dark-text logo only while the light bar is at rest; white logo otherwise.
    if (isLight) setLogo(!scrolled);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}
