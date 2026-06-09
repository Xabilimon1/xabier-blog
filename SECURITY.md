# Security policy

This repo is public and the site at <https://xabier-blog.vercel.app> is a personal blog. The threat model is small but real — the same OAuth proxy that lets me publish posts could be used to steal a GitHub access token if it had a bug.

## Reporting a vulnerability

If you find a security issue:

1. **Don't open a public GitHub issue.**
2. Email me directly at <xabier.ariznabarreta@gmail.com> with subject `[security] xabier-blog: ...`.
3. Please include: description, reproduction steps, impact, and any disclosure timeline you'd like.

I'll acknowledge within 72 hours and fix high-severity issues within 7 days.

## What's in scope

- The OAuth proxy at `/api/auth` and `/api/callback` (this is the critical path — it handles a GitHub `repo` scope token).
- The Decap CMS instance at `/admin/`.
- Any content rendered from MDX posts (XSS via post body, frontmatter, etc).
- Cookies, headers, response leakage.

## What's out of scope

- Third-party services we embed (GitHub Discussions via Giscus, fonts from Google Fonts, icons from Iconify CDN, Decap CMS bundle from unpkg). Report those upstream.
- Denial-of-service or rate-limit issues on Vercel's free tier — those are real but not actionable.
- Issues that require physical access to my machine or already-compromised GitHub credentials.

## Hardening notes

- The OAuth callback verifies the authenticated user has **push access** to this specific repo before handing the token back to Decap. Random GitHub users cannot use the CMS even if they get to the OAuth screen.
- The `state` parameter is generated server-side and matched against an `HttpOnly; Secure; SameSite=Lax` cookie before the token exchange.
- The token is posted back to the opener with a strict target origin matching the current deployment host.
- Security headers (HSTS, XCTO, X-Frame-Options, Referrer-Policy, Permissions-Policy) are set in `vercel.json`.
- `/admin/` and `/api/` carry `X-Robots-Tag: noindex, nofollow` and `Cache-Control: no-store`.

## Secrets

- `OAUTH_GITHUB_CLIENT_ID` — public, fine in env. Treated as secret out of habit.
- `OAUTH_GITHUB_CLIENT_SECRET` — server-side only, never sent to the browser, never logged.
- Both live in Vercel env vars under the project. They are not in this repo. See `.env.example` for the names.
