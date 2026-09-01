# Posts

This folder is where every blog post lives. One `.md` file = one post.

Only the repo owner can push to `main`, so only the repo owner can publish. Same pattern as Karpathy, Lilian Weng, Eugene Yan, Simon Willison — `git push` to publish.

## How to write a new post

1. Create `src/content/posts/YYYY-MM-DD-<slug>.md` — the file basename becomes the URL slug: `/posts/YYYY-MM-DD-<slug>/`.
2. Paste the frontmatter template below and edit it.
3. Write the body in plain Markdown.
4. `npm run dev` → preview at `localhost:4321/posts/YYYY-MM-DD-<slug>/`.
5. `git commit && git push` → Vercel rebuilds, post is live.

## Frontmatter template

```yaml
---
title: "De producción a research, a los 19"
excerpt: "Una frase corta que aparece en la lista del blog, en el OG y en el RSS."
publishedAt: 2026-06-09
category: meta              # tech | research | production | meta
readingMinutes: 8
icon: ph:compass-fill       # any Phosphor icon name (https://phosphoricons.com)
color: coral                # coral | mint | yellow | purple | blue
lang: es                    # es (default) | en
translationOf: ""           # optional — slug of the sibling-language post
draft: false                # true to hide from blog/RSS/home while drafting
---

Tu primer párrafo va aquí. Markdown puro.

## Una sección

Cuerpo del post. Listas, bloques de código, citas, todo soportado.

```python
def hola():
    return "mundo"
```
```

## Language toggle

The site is Spanish-first. To add an English version of a post:

1. Write the ES post as usual with `lang: es`.
2. Create a second file (any filename you want, e.g. `<slug>-en.md`) with `lang: en` and `translationOf: "<es-slug>"`.
3. Add `translationOf: "<en-slug>"` to the ES post's frontmatter so the link is bidirectional.
4. `PostLayout.astro` renders the ES/EN pill automatically when both files exist.

The blog index, home "Latest Posts" and RSS feed all filter by `lang === "es"` so translations don't duplicate cards.

## Categories

Pick one. Drives the chip filter on `/blog` and the badge color on every card.

- `tech` — rigorous technical deep-dive
- `research` — evals, agent harnesses, and current research work
- `production` — case study from a shipped system
- `meta` — journey, reflections, self-critique

## Icons

The cover icon comes from [Phosphor Icons](https://phosphoricons.com). Any `ph:*-fill` or `ph:*` name works. Pick one that matches the post's topic — `ph:flask-fill` for research, `ph:shield-check-fill` for security postmortems, `ph:atom-fill` for mech interp, `ph:books-fill` for paper-reading posts.

## Drafts

Set `draft: true` in frontmatter while writing. The post will be:

- Not on `/blog`
- Not on `/` (Latest Posts)
- Not in the RSS feed
- 404 in production builds

Flip to `false` when ready to ship.
