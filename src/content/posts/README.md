# Posts

This folder is where every blog post lives. One `.mdx` file = one post.

Only the repo owner (you) can push to `main`, so only the repo owner can publish a post. That is the standard pattern for personal tech blogs (Karpathy, Lilian Weng, Eugene Yan, Simon Willison — all of them publish by `git push`).

## How to write a new post

1. Create `src/content/posts/<slug>.mdx` — the slug becomes the URL: `/posts/<slug>/`
2. Paste the frontmatter template below and edit it.
3. Write the body in MDX (Markdown + optional Astro components).
4. `npm run dev` → preview at `localhost:4321/posts/<slug>/`.
5. `git commit && git push` → Vercel rebuilds, post is live.

## Frontmatter template

```yaml
---
title: "Why I'm pivoting from production agents to research at 19"
excerpt: "Eighteen months of shipping changed what I think the bottleneck is. A short note on why I'm re-orienting toward alignment work."
publishedAt: 2026-06-15
category: meta              # tech | research | production | meta
readingMinutes: 6
icon: ph:compass-fill       # any Phosphor icon name (https://phosphoricons.com)
color: purple               # coral | mint | yellow | purple | blue — controls the cover + badge
draft: false                # set true to hide from blog/RSS while you draft
---

Your first paragraph goes here. Markdown supported.

## A section heading

Body. Lists, code blocks, blockquotes — all fine.

```python
def hello():
    return "world"
```
```

## Categories

Pick one. They drive the chip filter on `/blog` and the badge color on every card.

- `tech` — rigorous technical deep-dive
- `research` — work in progress on the harness-ablation paper
- `production` — case study from a shipped system
- `meta` — journey, reflections, self-critique

## Icons

The cover icon comes from [Phosphor Icons](https://phosphoricons.com). Any `ph:*-fill` or `ph:*` name works. Pick something that matches the post's topic — `ph:flask-fill` for research, `ph:shield-check-fill` for security postmortems, `ph:atom-fill` for mech interp, `ph:books-fill` for paper-reading posts.

## Drafts

Set `draft: true` in frontmatter while you're writing. The post will:
- Not show on `/blog`
- Not show on `/` (Latest Posts)
- Not be in the RSS feed
- Not get a public URL (404 in production builds)

Flip to `false` when you're ready to ship.
