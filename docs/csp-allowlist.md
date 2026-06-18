# CSP allowlist — what each entry exists for

`vercel.json` enforces a single `Content-Security-Policy` header. Every entry below is load-bearing. **Removing one breaks something visible. Read this before editing CSP.**

## connect-src

| Origin | Used by | Breakage if removed |
|---|---|---|
| `'self'` | Astro hydration, RSS, internal fetches | All client-side data fetching dies |
| `https://giscus.app` | Giscus client polling | Comments stop loading reactions/replies |
| `https://api.github.com` | Giscus discussion fetches | Comment threads show empty |
| `https://api.iconify.design` | `iconify-icon` web component primary API | **Every `<iconify-icon>` renders blank** |
| `https://api.simplesvg.com` | iconify fallback #1 | Iconify falls back to here if primary is down |
| `https://api.unisvg.com` | iconify fallback #2 | iconify falls back to here if both above are down |

**Iconify regression history:** commit `71602f7` (2026-06-11) flipped CSP from `Content-Security-Policy-Report-Only` to enforced without adding the iconify endpoints to `connect-src`. Icons silently broke in prod for 7 days. Re-fixed 2026-06-18.

## script-src

| Origin | Used by | Breakage if removed |
|---|---|---|
| `'self'` | All same-origin scripts (Astro, doodles.js, animations.js, iconify-icon.min.js) | Site unusable |
| `'unsafe-inline'` | Astro inline hydration scripts | Astro components stop hydrating |
| `https://giscus.app` | Giscus client.js | Comments don't load at all |
| `https://va.vercel-scripts.com` | Vercel Analytics fallback | Analytics may break if Vercel serves from there |

## style-src / font-src

| Origin | Used by |
|---|---|
| `https://fonts.googleapis.com` (style) | Poppins font CSS |
| `https://fonts.gstatic.com` (font) | Poppins font binaries |

If Poppins ever gets self-hosted, remove both.

## img-src

| Origin | Used by |
|---|---|
| `'self'` | All local assets |
| `data:` | Inline favicons / SVGs |
| `https://avatars.githubusercontent.com` | Giscus user avatars |
| `https://*.giscus.app` | Giscus reaction images |

## frame-src

| Origin | Used by |
|---|---|
| `https://giscus.app` | Giscus iframe (the comments widget itself) |

## Rule before touching CSP

1. List every third-party script/widget/font used in the site.
2. For each, check its **runtime** API endpoints (not just the script origin). Iconify's script lived on `code.iconify.design` but its API is on `api.iconify.design` — separate.
3. Add all of them to the corresponding directive.
4. Deploy to a preview URL and open DevTools → Console → look for `Refused to ...` violations BEFORE promoting to prod.
5. Update this file. If you skipped step 5 you skipped CSP review.
