/**
 * sharing-article — a row of social share actions (email, Facebook, X, LinkedIn)
 * for the current article. Share targets are UI controls built from the page URL,
 * so they are generated here rather than authored as content. Any authored text
 * in the block (e.g. a "Share" label) is preserved ahead of the icons.
 */
const PLATFORMS = [
  { key: 'email', label: 'Share by email', href: (u, t) => `mailto:?subject=${t}&body=${u}` },
  { key: 'facebook', label: 'Share on Facebook', href: (u) => `https://www.facebook.com/sharer/sharer.php?u=${u}` },
  { key: 'twitter', label: 'Share on X', href: (u, t) => `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
  { key: 'linkedin', label: 'Share on LinkedIn', href: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
];

export default function decorate(block) {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(document.title || '');

  // Preserve any authored label, then clear the block for the generated list.
  const label = block.textContent.trim();
  block.textContent = '';

  if (label) {
    const span = document.createElement('span');
    span.className = 'sharing-article-label';
    span.textContent = label;
    block.append(span);
  }

  const list = document.createElement('ul');
  list.className = 'sharing-article-list';
  PLATFORMS.forEach((p) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = `sharing-article-icon sharing-article-${p.key}`;
    a.href = p.href(url, title);
    a.setAttribute('aria-label', p.label);
    if (p.key !== 'email') {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    }
    li.append(a);
    list.append(li);
  });
  block.append(list);
}
