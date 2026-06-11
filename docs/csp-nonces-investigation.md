# CSP `unsafe-inline` on script-src — investigation & accepted risk

**Date:** 2026-06-11
**Astro version at time of decision:** ^6.4.5
**Vercel adapter:** @astrojs/vercel ^10.0.8
**Status:** Keep `'unsafe-inline'` on `script-src`. Accepted, documented risk. Revisit when conditions below change.

## Current CSP (vercel.json)

```
script-src 'self' 'unsafe-inline' https://giscus.app https://va.vercel-scripts.com
```

The `'unsafe-inline'` is here because several inline / self-hosted scripts need to
execute without a CSP nonce:

- `src/layouts/Layout.astro` — three `<script is:inline>` tags loading
  `/iconify-icon.min.js`, `/doodles.js`, `/animations.js` from `public/`.
- `src/components/Comments.astro` — `<script is:inline>` loading
  `https://giscus.app/client.js` with `data-*` config attributes.
- `@vercel/analytics/astro` and `@vercel/speed-insights/astro` — inject their own
  inline bootstrap snippets at build time.

## Options evaluated

### Option A — Astro 6 `experimental.csp`

Per https://docs.astro.build/en/reference/experimental-flags/csp/ the feature
has hard limitations that make it a non-starter for *this* blog right now:

1. **Prerendered routes are not covered.** Every route in this repo is
   prerendered (`output: 'server'` is kept only so the Vercel adapter wires
   `@vercel/analytics` cleanly; every page exports `prerender = true` and the
   build log confirms 8/8 static prerendered routes). The CSP feature only
   injects nonces/hashes on routes "rendered on demand (SSR)". So enabling the
   flag would change `astro.config.mjs` but produce zero effect on the HTML
   Vercel actually serves.
2. **External scripts are explicitly unsupported.** Giscus (`giscus.app/client.js`)
   and Vercel Analytics (`va.vercel-scripts.com/...`) are loaded as external
   scripts — Astro's CSP feature does not hash or nonce them.
3. **`is:inline` scripts are out of scope.** Astro only emits hashes for *its
   own* bundled scripts (client islands). The three `is:inline` tags in
   `Layout.astro` and the Giscus tag in `Comments.astro` would still be blocked
   without `'unsafe-inline'` (or matching hashes/nonces we'd have to maintain
   by hand).
4. **Shiki incompatibility.** MDX posts use Shiki for code highlighting; the
   docs flag this as incompatible with the CSP feature.

Net effect: enabling the flag would not let us drop `'unsafe-inline'` — at best
it would harden a future SSR-only route we don't yet have.

### Option B — Vercel middleware that injects a per-request nonce

Technically feasible (Edge middleware would generate a nonce, rewrite the HTML
to add `nonce="..."` to every `<script>` tag, and set a `script-src 'self'
'nonce-<value>'` header). Reasons not to do it today:

1. **It defeats Vercel's static cache.** The pages are prerendered HTML served
   from the CDN; rewriting them per request to inject a fresh nonce turns every
   request into a function invocation. We pay latency + function budget for a
   blog with no logged-in users.
2. **Giscus's `client.js` injects further inline scripts into the iframe parent
   shadow DOM.** Even with a nonce on the outer `<script>` tag, Giscus's runtime
   uses dynamic script insertion that won't carry our nonce. We'd still need
   `'unsafe-inline'` or `strict-dynamic`, and `strict-dynamic` removes the
   protection of the host allowlist anyway.
3. **Vercel Analytics + Speed Insights** do the same thing — their boot
   snippets dynamically append further scripts. Again, `strict-dynamic` would
   be the only realistic path, and it weakens the policy in a different way.
4. **Maintenance cost vs. threat model.** This is a static personal blog with
   no user-authored HTML rendered server-side, no comment input rendered into
   the page (Giscus runs inside its own iframe), and no auth surface. The XSS
   attack surface is essentially zero. Spending engineering time on a
   nonce/middleware stack here is poor ROI.

## Accepted risk

We keep `'unsafe-inline'` on `script-src` for now. The remaining defences are:

- Strict `default-src 'self'` and an explicit allowlist on every other directive
  (`frame-src`, `connect-src`, `img-src`, `font-src`, `style-src`).
- `frame-ancestors 'self'` and `X-Frame-Options: SAMEORIGIN` (clickjacking).
- HSTS preload, `X-Content-Type-Options: nosniff`, restrictive
  `Permissions-Policy`, `Referrer-Policy: strict-origin-when-cross-origin`.
- No user-generated content rendered server-side; comments live entirely inside
  the Giscus iframe.

The realistic XSS vector would be a compromised dependency (`iconify-icon`,
`@vercel/analytics`, Giscus). `'unsafe-inline'` does not change that exposure
materially — a supply-chain attacker can already publish a malicious external
script that our existing allowlist trusts.

## When to revisit

Drop `'unsafe-inline'` and switch to nonces/hashes if **any** of these change:

1. We move to non-prerendered SSR routes (e.g. an admin panel, a dashboard, an
   API-driven page) where Astro's `experimental.csp` will actually apply.
2. We remove Giscus (or it ships a nonce-aware loader) **and** Vercel Analytics
   ships a nonce-aware loader. Both today rely on dynamic inline script
   insertion.
3. Astro's CSP feature gains support for prerendered routes **and** for
   `is:inline` scripts with stable hashes — at that point we can replace the
   four self-hosted inline tags with hashed entries instead of `'unsafe-inline'`.
4. We add an auth surface or any server-rendered user input — the threat model
   changes and the cost/benefit flips.

Until then: documented risk, accepted.
