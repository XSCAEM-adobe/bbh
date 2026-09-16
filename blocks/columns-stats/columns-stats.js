export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-stats-${cols.length}-cols`);

  // Each cell is a stat: large number (first line) + label (following lines).
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      col.classList.add('columns-stats-item');

      const first = col.querySelector(':scope > p, :scope > h1, :scope > h2, :scope > h3');
      if (first) first.classList.add('columns-stats-number');
    });
  });
}
