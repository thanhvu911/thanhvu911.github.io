/** Cards with [data-glow] get a faint gold highlight that follows the cursor (mouse only, not with reduced motion). */
export function glowCards(root: ParentNode = document) {
  if (matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) return;
  root.querySelectorAll<HTMLElement>('[data-glow]').forEach((el) => {
    if (el.dataset.glowOn) return;
    el.dataset.glowOn = '1';
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

// Adds "is-in" to every [data-inview] element the first time it is scrolled into
// view. Components use it to start a one-time CSS animation.
export function watchInView(root: ParentNode = document) {
  const els = Array.from(root.querySelectorAll<HTMLElement>('[data-inview]:not(.is-in)'));
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach((e) => e.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      }
    },
    { threshold: 0.35 },
  );
  els.forEach((e) => io.observe(e));
}
