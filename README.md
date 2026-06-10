# xabier-blog

Source for [xabier.me](https://xabier.me) (also reachable at `xabier-blog.vercel.app`).

Personal research notebook. Astro 6 + Tailwind 4. Public artefact of pivoting from production agents to research.

## Stack

- Astro 6 with the glob content loader
- Tailwind 4 (via `@tailwindcss/vite`)
- `@astrojs/vercel` adapter, `output: "server"` with every page set to `prerender = true`
- Giscus comments (GitHub Discussions, category `Announcements`)
- Vercel Web Analytics + Speed Insights (via `@vercel/analytics/astro` and `@vercel/speed-insights/astro`)
- Hosted on Vercel, custom domain `xabier.me` registered through Vercel

## Run locally

```sh
npm install
npm run dev        # localhost:4321
npm run build      # static output under .vercel/output/
npm run preview    # serve the build
```

## Structure

```
src/
├── components/
│   ├── Sidebar.astro       ← left vertical nav, used on every page
│   └── Comments.astro      ← Giscus widget
├── layouts/
│   ├── Layout.astro        ← page shell + analytics + speed insights
│   └── PostLayout.astro    ← post page: hero + prose + ES/EN toggle + comments
├── pages/
│   ├── index.astro         ← home (filters posts by lang === "es")
│   ├── about.astro
│   ├── blog.astro          ← post listing (filters posts by lang === "es")
│   ├── contact.astro
│   ├── resume.astro
│   ├── rss.xml.ts          ← Spanish RSS feed
│   └── posts/
│       └── [...slug].astro ← dynamic post route, uses entry.id (Astro 6 glob loader API)
├── content/
│   └── posts/              ← every post is a .md file here (see README inside)
└── content.config.ts       ← post collection schema (frontmatter validation)
```

## Writing a new post

See `src/content/posts/README.md` for the frontmatter template. Short version:

1. Create `src/content/posts/YYYY-MM-DD-<slug>.md` for the Spanish version.
2. Optionally create `src/content/posts/YYYY-MM-DD-<slug>-en.md` (or any slug) for the English version with `lang: "en"` and `translationOf: "<sibling-slug>"`.
3. Both posts cross-link via `translationOf` — the toggle renders automatically when a sibling exists.
4. `git push` to `main` → Vercel rebuilds → live.

Only the repo owner can push to `main`, so only the repo owner can publish. Same pattern as Karpathy, Lilian Weng, Eugene Yan, Simon Willison.

## Language toggle

Posts have a `lang` field (`es` default) and an optional `translationOf` slug pointing at the sibling-language version. When both languages exist, `PostLayout.astro` renders a small ES/EN pill in the post header.

The blog index and RSS feed both filter by `lang === "es"` so translations don't duplicate cards.

## Comments

Giscus is wired live. Comments are stored as GitHub Discussions on this repo under the `Announcements` category. To moderate or delete a comment, use the GitHub Discussions UI or `gh api graphql`.

## Analytics

Vercel Web Analytics and Speed Insights are wired via Astro components in `Layout.astro`. Both load from same-origin `/_vercel/insights/*` and `/_vercel/speed-insights/*` paths, so no CSP changes are needed.

The dashboards live under the Vercel project → Analytics / Speed Insights tabs. Both features must be enabled at the project level in the Vercel dashboard for data collection to start.

## Design tokens

Colors, fonts, doodles and animations live in `public/styles.css`, `public/doodles.js` and `public/animations.js`. Edit those, hard-refresh.

## Deploy

Connected to Vercel. Push to `main` → Vercel builds and aliases the new deployment to `xabier-blog.vercel.app` and `xabier.me` automatically through the Git integration. Manual deploys via `vercel --prod --yes` also work.

## License

MIT.
