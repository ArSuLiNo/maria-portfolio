const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── sticky nav state ─────────────────────────────────────── */

const nav = document.getElementById('nav');
const progress = document.getElementById('progress');

const onScroll = () => {
  nav.classList.toggle('is-stuck', scrollY > 8);
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
};
onScroll();
addEventListener('scroll', onScroll, { passive: true });

/* ── reveal on enter ──────────────────────────────────────── */

/* Everything that should animate in gets tagged here rather than by hand in
   the markup, so the HTML stays about content. */
const targets = document.querySelectorAll(
  '.reveal, .section__head, .case__meta, .case__title, .case__sub, .block, ' +
  '.case__visual img, .project, .step, .calendar, .logos figure, .gallery img, ' +
  '.about__main, .facts, .contact__title, .contact__links, .case__caption'
);

targets.forEach((el) => el.classList.add('anim'));

if (reduced) {
  targets.forEach((el) => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

  targets.forEach((el) => io.observe(el));

  /* Stagger siblings inside a group so a row arrives as a sequence, not a
     single blink. Index is baked in once, up front. */
  document.querySelectorAll(
    '.metrics, .steps, .case__blocks, .projects, .logos, .gallery, .case__visual'
  ).forEach((group) => {
    [...group.children].forEach((child, i) => {
      child.style.setProperty('--i', Math.min(i, 5));
    });
  });
}

/* ── metric counters ──────────────────────────────────────── */

/* Counts up to the number already in the markup, so the page still reads
   correctly with JS off or before this runs. */
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

function countUp(el) {
  const raw = el.textContent.trim();
  const match = raw.match(/^([\d,]+)(.*)$/);
  if (!match) return;

  const target = Number(match[1].replace(/,/g, ''));
  const suffix = match[2];
  const grouped = match[1].includes(',');
  const duration = 1400;
  let start;

  const frame = (now) => {
    start ??= now;
    const t = Math.min((now - start) / duration, 1);
    const value = Math.round(target * easeOut(t));
    el.textContent = (grouped ? value.toLocaleString('en-US') : String(value)) + suffix;
    if (t < 1) requestAnimationFrame(frame);
  };

  requestAnimationFrame(frame);
}

if (!reduced) {
  const numbers = document.querySelectorAll('.metric__num');
  const countObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      countUp(entry.target);
      countObserver.unobserve(entry.target);
    }
  }, { threshold: 0.6 });

  numbers.forEach((el) => countObserver.observe(el));
}
