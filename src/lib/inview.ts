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
