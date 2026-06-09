/* Floating background doodles — Bolby style.
   - Confined to LEFT (0–20%) and RIGHT (80–100%) gutters.
   - CURSOR parallax: each doodle drifts a different amount toward/away from the mouse.
   - Idle sinusoidal sway so nothing feels frozen.
   - Honors prefers-reduced-motion. */
(function () {
  const doodles = `
<svg viewBox="0 0 100 100" width="30" height="30" style="top:2%;left:11%;color:var(--d-yellow);transform:rotate(-12deg);" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"><path d="M20 60 Q50 30 80 60"/></svg>
<svg viewBox="0 0 100 100" width="32" height="32" style="top:3%;right:7%;color:var(--d-purple);transform:rotate(-35deg);" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"><path d="M20 50 Q50 20 80 50"/></svg>
<svg viewBox="0 0 100 100" width="14" height="14" style="top:8%;right:18%;color:var(--d-yellow);" fill="currentColor"><circle cx="50" cy="50" r="38"/></svg>
<svg viewBox="0 0 100 100" width="18" height="18" style="top:13%;left:19%;color:var(--d-mint);" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round"><circle cx="50" cy="50" r="30"/></svg>
<svg viewBox="0 0 100 100" width="20" height="20" style="top:11%;left:9%;color:var(--d-ink);" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round"><path d="M20 80 L80 20"/></svg>
<svg viewBox="0 0 100 100" width="22" height="22" style="top:18%;right:11%;color:var(--d-coral);" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round"><path d="M20 80 L50 20 L80 80 Z"/></svg>
<svg viewBox="0 0 100 100" width="28" height="28" style="top:22%;left:6%;color:var(--d-coral);transform:rotate(70deg);" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"><path d="M20 50 Q50 20 80 50"/></svg>
<svg viewBox="0 0 100 100" width="18" height="18" style="top:24%;right:7%;color:var(--d-ink);" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round"><path d="M30 30 L70 70 M70 30 L30 70"/></svg>
<svg viewBox="0 0 100 100" width="26" height="26" style="top:30%;left:17%;color:var(--d-yellow);transform:rotate(20deg);" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"><path d="M20 60 Q50 30 80 60"/></svg>
<svg viewBox="0 0 100 100" width="20" height="20" style="top:36%;right:18%;color:var(--d-mint);" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round"><path d="M50 20 L50 80 M20 50 L80 50"/></svg>
<svg viewBox="0 0 100 100" width="24" height="24" style="top:40%;left:5%;color:var(--d-coral);" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"><path d="M20 60 Q50 30 80 60"/></svg>
<svg viewBox="0 0 100 100" width="30" height="30" style="top:48%;right:5%;color:var(--d-purple);transform:rotate(15deg);" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"><path d="M20 50 Q50 20 80 50"/></svg>
<svg viewBox="0 0 100 100" width="18" height="18" style="top:52%;left:18%;color:var(--d-ink);" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round"><path d="M30 30 L70 70 M70 30 L30 70"/></svg>
<svg viewBox="0 0 100 100" width="22" height="22" style="top:58%;right:19%;color:var(--d-yellow);transform:rotate(-20deg);" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round"><path d="M30 40 Q50 80 70 40"/></svg>
<svg viewBox="0 0 100 100" width="14" height="14" style="top:64%;left:9%;color:var(--d-coral);" fill="currentColor"><circle cx="50" cy="50" r="30"/></svg>
<svg viewBox="0 0 100 100" width="26" height="26" style="top:70%;right:6%;color:var(--d-purple);" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"><path d="M20 60 Q50 30 80 60"/></svg>
<svg viewBox="0 0 100 100" width="20" height="20" style="top:76%;left:7%;color:var(--d-mint);" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round"><circle cx="50" cy="50" r="30"/></svg>
<svg viewBox="0 0 100 100" width="24" height="24" style="top:82%;right:14%;color:var(--d-yellow);transform:rotate(20deg);" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"><path d="M20 60 Q50 30 80 60"/></svg>
<svg viewBox="0 0 100 100" width="18" height="18" style="top:88%;left:16%;color:var(--d-coral);" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round"><path d="M30 30 L70 70 M70 30 L30 70"/></svg>
<svg viewBox="0 0 100 100" width="22" height="22" style="top:94%;right:9%;color:var(--d-purple);" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round"><circle cx="50" cy="50" r="30"/></svg>
`;
  const wrap = document.createElement('div');
  wrap.className = 'doodles';
  wrap.innerHTML = doodles;
  const card = document.querySelector('.card');
  if (!card) return;
  card.prepend(wrap);

  // ---------- Reduced motion: bail out ----------
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // ---------- Per-doodle config ----------
  const items = [...wrap.querySelectorAll('svg')].map(el => {
    const base = el.style.transform || '';
    // factor magnitude (px the doodle drifts at max cursor extent).
    // Random sign so some go with the cursor, some against — feels alive.
    const mag = 14 + Math.random() * 26;          // 14..40
    const sign = Math.random() < 0.5 ? -1 : 1;
    return {
      el,
      base,
      magX: mag * sign,
      magY: mag * (Math.random() < 0.5 ? -1 : 1) * (0.6 + Math.random() * 0.6),
      rotMag: (Math.random() * 4 + 1) * sign,    // small rotation reaction
      swayAmp: 2.5 + Math.random() * 3.5,
      swayFreq: 0.25 + Math.random() * 0.35,
      swayPhase: Math.random() * Math.PI * 2,
    };
  });

  // ---------- Cursor target (normalized -0.5..0.5) ----------
  let targetX = 0, targetY = 0;
  let smoothX = 0, smoothY = 0;

  window.addEventListener('pointermove', e => {
    targetX = (e.clientX / window.innerWidth)  - 0.5;
    targetY = (e.clientY / window.innerHeight) - 0.5;
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    targetX = 0; targetY = 0;
  }, { passive: true });

  // ---------- Animation loop ----------
  let t0 = performance.now();
  function tick(t) {
    const dt = Math.min(64, t - t0) / 1000;
    t0 = t;
    const ts = t / 1000;

    // Critically-damped lerp toward the cursor target.
    const k = 1 - Math.pow(0.001, dt); // ~smooth ease, framerate-independent
    smoothX += (targetX - smoothX) * k;
    smoothY += (targetY - smoothY) * k;

    for (const it of items) {
      const sway   = Math.sin(ts * it.swayFreq + it.swayPhase) * it.swayAmp;
      const swayY  = Math.cos(ts * it.swayFreq * 0.8 + it.swayPhase) * it.swayAmp * 0.6;
      const tx     = smoothX * it.magX + sway;
      const ty     = smoothY * it.magY + swayY;
      const rot    = smoothX * it.rotMag;

      // base applied last (innermost) so its rotate(...) sets the rest pose
      // and our translate/rotate operate in screen space on top of it.
      it.el.style.transform =
        `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) rotate(${rot.toFixed(2)}deg) ${it.base}`;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
