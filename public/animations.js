/* Bolby-style entrance + counter animations.
   - Stat counters animate from 0 to target on enter viewport.
   - Skill bars expand from 0 to inline-styled width on enter viewport.
   - Sections / cards reveal (fade + translate up) on enter viewport.
   - Hero content reveals immediately on load with a small stagger.
   - All gated by IntersectionObserver, one-shot.
   - Honors prefers-reduced-motion (skips animation, shows end state). */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------- Reveal on scroll ----------------
  const revealTargets = document.querySelectorAll(
    '.hero, .section, .post-card, .post-hero, .post-cover-large, .prose, .about-page-hero, .values-grid > *, .contact-grid > *'
  );
  revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.setProperty('--reveal-delay', `${Math.min(i * 60, 360)}ms`);
  });

  if (reduceMotion) {
    revealTargets.forEach(el => el.classList.add('is-in'));
    document.querySelectorAll('.skill-bar').forEach(b => b.style.transition = 'none');
    runCounters(document, /* instant */ true);
    return;
  }

  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    }
  }, { rootMargin: '-8% 0px -8% 0px', threshold: 0.05 });
  revealTargets.forEach(el => io.observe(el));

  // ---------------- Skill bars ----------------
  // Read the author's target width (inline style="width:85%"), reset to 0,
  // and expand on enter viewport.
  const bars = document.querySelectorAll('.skill-bar');
  bars.forEach(bar => {
    const target = bar.style.width || '0%';
    bar.dataset.target = target;
    bar.style.width = '0%';
  });
  const barIO = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const bar = e.target;
      // small stagger inside the same .about-skills group
      const group = bar.closest('.about-skills');
      const peers = group ? [...group.querySelectorAll('.skill-bar')] : [bar];
      const idx = peers.indexOf(bar);
      bar.style.transitionDelay = `${idx * 120}ms`;
      bar.style.width = bar.dataset.target;
      barIO.unobserve(bar);
    }
  }, { threshold: 0.4 });
  bars.forEach(b => barIO.observe(b));

  // ---------------- Stat counters ----------------
  const statIO = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      animateCounter(e.target);
      statIO.unobserve(e.target);
    }
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-value').forEach(el => statIO.observe(el));

  function runCounters(root, instant) {
    root.querySelectorAll('.stat-value').forEach(el => animateCounter(el, instant));
  }

  function animateCounter(el, instant) {
    const raw = el.textContent.trim();
    // Match an integer (with optional sign) anywhere in the string,
    // preserve any prefix/suffix like "+", "%", "k".
    const m = raw.match(/^(\D*?)(-?\d+)(\D*)$/);
    if (!m) return; // e.g. "∞" — leave as-is
    const prefix = m[1];
    const target = parseInt(m[2], 10);
    const suffix = m[3];

    if (instant) {
      el.textContent = prefix + target + suffix;
      return;
    }

    const duration = 1100; // ms
    const start = performance.now();
    const from = 0;

    function frame(t) {
      const p = Math.min(1, (t - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(from + (target - from) * eased);
      el.textContent = prefix + val + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    el.textContent = prefix + '0' + suffix;
    requestAnimationFrame(frame);
  }
})();
