// Site-wide motion: smooth scrolling, scroll reveals, count-up numbers,
// card tilt, magnetic buttons, and the rotating hero role.
// Everything here is skipped when the visitor prefers reduced motion.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const NAV_OFFSET = -72;

gsap.registerPlugin(ScrollTrigger);

function smoothScroll() {
  const lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4) });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // In-page anchors glide instead of jumping.
  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
    if (!link) return;
    const url = new URL(link.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    const target = document.querySelector(url.hash);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target as HTMLElement, { offset: url.hash === '#home' ? 0 : NAV_OFFSET });
    history.pushState(null, '', url.hash);
  });
}

function reveals() {
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 28,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
  gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((group) => {
    gsap.from(group.children, {
      opacity: 0,
      y: 24,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: { trigger: group, start: 'top 85%', once: true },
    });
  });
}

function countUps() {
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals ?? 0);
    const state = { v: 0 };
    el.textContent = (0).toFixed(decimals);
    gsap.to(state, {
      v: end,
      duration: 1.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => (el.textContent = state.v.toFixed(decimals)),
    });
  });
}

function tiltCards() {
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    const max = 6;
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', `${x * 100}%`);
      card.style.setProperty('--my', `${y * 100}%`);
      gsap.to(card, {
        rotateY: (x - 0.5) * max * 2,
        rotateX: (0.5 - y) * max * 2,
        transformPerspective: 900,
        duration: 0.4,
        ease: 'power2.out',
      });
    });
    card.addEventListener('pointerleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' });
    });
  });
}

function magnetic() {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - r.left - r.width / 2) * 0.25,
        y: (e.clientY - r.top - r.height / 2) * 0.35,
        duration: 0.3,
        ease: 'power2.out',
      });
    });
    el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' }));
  });
}

function rotatingRole() {
  const el = document.querySelector<HTMLElement>('[data-rotate]');
  if (!el) return;
  const words = (el.dataset.rotate ?? '').split('|');
  let i = 0;
  setInterval(() => {
    i = (i + 1) % words.length;
    gsap
      .timeline()
      .to(el, { yPercent: -60, opacity: 0, duration: 0.35, ease: 'power2.in' })
      .call(() => (el.textContent = words[i]))
      .fromTo(el, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: 'power3.out' });
  }, 2600);
}

if (!reduceMotion) {
  smoothScroll();
  reveals();
  countUps();
  rotatingRole();
  if (finePointer) {
    tiltCards();
    magnetic();
  }
}
