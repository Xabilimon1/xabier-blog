# xabier-blog

> A public research notebook. Builder pivoting to researcher, written in the open.

[![Live](https://img.shields.io/badge/_-xabier.me-fc6471?style=flat-square&labelColor=0a0a0a)](https://xabier.me)
[![Built with Astro](https://img.shields.io/badge/_-Astro_6-0a0a0a?style=flat-square&labelColor=fc6471)](https://astro.build)
[![Styled with Tailwind](https://img.shields.io/badge/_-Tailwind_4-fc6471?style=flat-square&labelColor=0a0a0a)](https://tailwindcss.com)
[![Hosted on Vercel](https://img.shields.io/badge/_-Vercel-0a0a0a?style=flat-square&labelColor=fc6471)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/_-MIT-fc6471?style=flat-square&labelColor=0a0a0a)](LICENSE)
[![Last commit](https://img.shields.io/github/last-commit/Xabilimon1/xabier-blog?style=flat-square&color=0a0a0a&labelColor=fc6471&label=)](https://github.com/Xabilimon1/xabier-blog/commits/main)

Posts ship by `git push`. Comments live on GitHub Discussions. No CMS, no editor, no platform lock-in. Same pattern as Karpathy, Lilian Weng, Eugene Yan, Simon Willison.

---

## Stack

| Layer       | Tool                                                            |
|-------------|-----------------------------------------------------------------|
| Framework   | [Astro 6](https://astro.build) (glob content loader)            |
| Styles      | [Tailwind 4](https://tailwindcss.com) via Vite plugin           |
| Hosting     | [Vercel](https://vercel.com), adapter `@astrojs/vercel`         |
| Comments    | [Giscus](https://giscus.app) on GitHub Discussions              |
| Analytics   | `@vercel/analytics` + `@vercel/speed-insights` (Astro components) |
| Domain      | `xabier.me` (registered via Vercel)                             |

---

## Run locally

```sh
npm install
npm run dev        # → http://localhost:4321
npm run build      # static output under .vercel/output/
npm run preview    # serve the build
```

---

## Structure

```
src/
├── components/
│   ├── Sidebar.astro       left vertical nav, used on every page
│   └── Comments.astro      Giscus widget
├── layouts/
│   ├── Layout.astro        shell + analytics + speed insights
│   └── PostLayout.astro    hero + prose + ES/EN toggle + comments
├── pages/
│   ├── index.astro         home — filters posts by lang === "es"
│   ├── about.astro
│   ├── blog.astro          listing — filters posts by lang === "es"
│   ├── contact.astro
│   ├── resume.astro
│   ├── rss.xml.ts          Spanish RSS feed
│   └── posts/
│       └── [...slug].astro dynamic post route, uses entry.id
├── content/
│   └── posts/              one .md file per post (see README inside)
└── content.config.ts       collection schema
```

---

## Writing

See [`src/content/posts/README.md`](src/content/posts/README.md) for the frontmatter template. TL;DR:

```sh
cp src/content/posts/2026-06-09-de-produccion-a-research-a-los-19.md \
   src/content/posts/$(date +%Y-%m-%d)-<slug>.md
# edit
git add . && git commit -m "post: <slug>" && git push
```

Only the repo owner can push to `main` → only the repo owner can publish.

---

## Bilingual posts

Each post has a `lang` field (default `es`) and an optional `translationOf` slug pointing at the sibling-language version. When both files exist, `PostLayout.astro` renders the ES/EN pill in the post header. The blog index, home and RSS feed all filter by `lang === "es"` so translations don't duplicate cards.

```yaml
# Spanish version
lang: es
translationOf: 2026-06-09-from-production-to-research-at-19

# English version
lang: en
translationOf: 2026-06-09-de-produccion-a-research-a-los-19
```

---

## Comments

Giscus is live, anchored to this repo's Discussions under the `Announcements` category. Moderation via the GitHub UI or `gh api graphql`.

---

## Analytics

Wired through Astro components in `Layout.astro`. Both scripts load from same-origin `/_vercel/insights/*` paths, so the existing CSP covers them with no changes. Dashboards are under the Vercel project → Analytics / Speed Insights tabs.

---

## Deploy

Push to `main` → Vercel rebuilds → new build is aliased to `xabier-blog.vercel.app` and `xabier.me`. Manual deploys via `vercel --prod --yes` also work.

---

## License

MIT — see [LICENSE](LICENSE).
