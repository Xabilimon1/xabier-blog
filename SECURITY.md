# Security policy

This repo powers <https://xabier.me>, a personal research notebook. There is no authentication, no user-generated content stored on this domain, and no server-side code beyond what Astro and the Vercel adapter generate. The threat surface is small but worth listing explicitly.

## Reporting a vulnerability

1. **Don't open a public GitHub issue.**
2. Email me at <xabier.ariznabarreta@gmail.com> with subject `[security] xabier-blog: ...`.
3. Include: description, reproduction steps, impact, and any disclosure timeline you'd like.

I'll acknowledge within 72 hours and fix high-severity issues within 7 days where I'm in control of the fix.

## In scope

- Any XSS or HTML-injection rendering posts from Markdown frontmatter or body content.
- Any leakage of headers, cookies, or response bodies through the Vercel deployment.
- Misconfiguration of CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy or Permissions-Policy.
- Outdated dependencies with known CVEs that affect the served bundle.
- Compromise vectors through the third-party scripts we load (Iconify, Giscus, Vercel Analytics) — but only where this repo could mitigate them, e.g. by pinning version + SRI.
- The static contact form: it posts via `mailto:` and stores no data server-side, so issues here are mostly UX, but report anything weird.

## Out of scope

- Issues in third-party services we embed — GitHub Discussions (via Giscus), Google Fonts, Iconify CDN, Vercel Analytics / Speed Insights. Report those upstream.
- Denial-of-service or rate-limit issues on Vercel's free tier.
- Issues that require physical access to my machine or already-compromised GitHub credentials.
- Open-redirect or auth-flow issues — there is no auth flow on this site.

## Hardening notes

- All pages are statically rendered (`prerender = true`); there are no API endpoints.
- Comments go through Giscus → GitHub Discussions; only the repo owner (push access) can create new Discussion threads under the configured category.
- The Iconify CDN script is pinned to a specific version with an SRI `integrity` hash.
- The contact form uses a `mailto:` action, so no third-party processor sees the message.
- CSP is enforced (not Report-Only). `script-src` allows only `'self'`, Iconify, Giscus and Vercel Analytics fallback.
- HSTS is set to two years with `preload`, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, plus a tight `Permissions-Policy`.
- `npm audit` is clean as of the last commit; overrides are used to pull transitive vulnerabilities forward when an upstream fix isn't yet released.

## Known accepted risks

- **Giscus script has no SRI.** Giscus does not publish stable hashes and recommends loading without `integrity`. We accept that the comments widget could be tampered with by a Giscus CDN compromise. Comments are non-load-bearing for site content.
- **`'unsafe-inline'` in `script-src`.** Required by Astro's hydration model. Mitigated by the fact that no user input reaches the page DOM as raw HTML.
