export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-statement-${cols.length}-cols`);

  // Two-column statement: headline column (left) + supporting paragraph column (right).
  [...block.children].forEach((row) => {
    [...row.children].forEach((col, i) => {
      col.classList.add('columns-statement-col');
      col.classList.add(i === 0 ? 'columns-statement-lead' : 'columns-statement-body');
    });
  });
}
