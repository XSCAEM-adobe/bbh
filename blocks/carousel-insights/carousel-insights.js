import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function updateActiveSlide(block, index) {
  const track = block.querySelector('.carousel-insights-track');
  const slides = [...track.children];
  const clamped = Math.max(0, Math.min(index, slides.length - 1));
  block.dataset.activeSlide = clamped;

  const target = slides[clamped];
  if (target) {
    track.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
  }

  block.querySelectorAll('.carousel-insights-dot').forEach((dot, idx) => {
    dot.setAttribute('aria-current', idx === clamped ? 'true' : 'false');
  });
}

export default function decorate(block) {
  const rows = [...block.children];

  // Build the sliding track of insight cards.
  const track = document.createElement('ul');
  track.className = 'carousel-insights-track';

  rows.forEach((row) => {
    const li = document.createElement('li');
    li.className = 'carousel-insights-slide';
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'carousel-insights-slide-image';
      } else {
        div.className = 'carousel-insights-slide-body';
      }
    });
    track.append(li);
  });

  track.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(track);

  const slideCount = track.children.length;
  if (slideCount < 2) return;

  // Navigation arrows.
  const nav = document.createElement('div');
  nav.className = 'carousel-insights-nav';
  nav.innerHTML = `
    <button type="button" class="carousel-insights-prev" aria-label="Previous"></button>
    <button type="button" class="carousel-insights-next" aria-label="Next"></button>
  `;
  block.append(nav);

  // Dot indicators.
  const dots = document.createElement('ol');
  dots.className = 'carousel-insights-dots';
  [...track.children].forEach((_, idx) => {
    const dot = document.createElement('li');
    dot.innerHTML = `<button type="button" class="carousel-insights-dot" aria-label="Show slide ${idx + 1}"></button>`;
    dots.append(dot);
  });
  block.append(dots);

  block.dataset.activeSlide = 0;
  updateActiveSlide(block, 0);

  nav.querySelector('.carousel-insights-prev').addEventListener('click', () => {
    updateActiveSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
  });
  nav.querySelector('.carousel-insights-next').addEventListener('click', () => {
    updateActiveSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
  });
  dots.querySelectorAll('.carousel-insights-dot').forEach((dot, idx) => {
    dot.addEventListener('click', () => updateActiveSlide(block, idx));
  });
}
