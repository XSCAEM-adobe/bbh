export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-business-lines-${cols.length}-cols`);

  // Each row cell is a promo panel: heading + paragraph + link.
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      col.classList.add('columns-business-lines-panel');

      // Promote a picture-only cell to an image column (defensive; panels are text-first here).
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-business-lines-img-col');
        }
      }

      // Tag the CTA link so it can be styled as a "Learn more" affordance.
      const link = col.querySelector('a');
      if (link) link.classList.add('columns-business-lines-cta');
    });
  });
}
