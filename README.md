# xabier-blog

Source for [xabier-blog.vercel.app](https://xabier-blog.vercel.app) (custom domain: `xabier.dev`, pending).

Personal research notebook. Astro + MDX. Designed to be a public artefact of pivoting from production agents to research.

## Run locally

```sh
npm install
npm run dev        # localhost:4321
npm run build      # static output → ./dist
npm run preview    # serve the build
```

## Structure

```
src/
├── components/
│   ├── Sidebar.astro     ← left vertical nav, used on every page
│   └── Comments.astro    ← Giscus comments (see SETUP_GISCUS.md)
├── layouts/
│   ├── Layout.astro      ← page shell: sidebar + content slot + scripts
│   └── PostLayout.astro  ← post page: hero + prose + comments
├── pages/
│   ├── index.astro       ← home
│   ├── about.astro       ← long-form about
│   ├── blog.astro        ← post listing with category chips
│   ├── contact.astro     ← email + form
│   ├── resume.astro      ← education + experience + skills
│   ├── rss.xml.ts        ← RSS feed
│   └── posts/
│       └── [...slug].astro ← dynamic post route — reads from content collection
├── content/
│   └── posts/            ← every post is a .mdx file here (see README inside)
└── content.config.ts     ← post collection schema (frontmatter validation)
```

## Writing a new post

See `src/content/posts/README.md`. Short version:

1. Create `src/content/posts/<slug>.mdx`
2. Paste the frontmatter template, edit
3. Write the body
4. `git push` → Vercel rebuilds → post is live

Because only the repo owner can push, only the repo owner can publish. That's the canonical personal-blog model (Karpathy, Lilian Weng, Eugene Yan, Simon Willison all work this way).

## Comments

Powered by [Giscus](https://giscus.app) → comments are stored in GitHub Discussions on this repo. Until you finish the setup (see `SETUP_GISCUS.md`), the comments section renders a friendly placeholder telling readers to check back later.

To enable:

1. Follow `SETUP_GISCUS.md` (10 minutes).
2. Open `src/components/Comments.astro`.
3. Paste your `repoId` and `categoryId` over the `REPLACE_ME_*` strings.
4. Push.

The component flips from placeholder to live widget automatically.

## Design tokens

The colors, fonts, doodles, and animations live in `public/styles.css`, `public/doodles.js`, and `public/animations.js`. Edit those, hard-refresh.

## Deploy

Connected to Vercel. Push to `main` → Vercel builds → public at `xabier-blog.vercel.app`.

## License

MIT.
