# Content Strategy — xabier.me

House style for titles + meta descriptions + posts. Keep it consistent so Google and readers know what to expect.

## Title patterns (max 60 chars, brand suffix)

Format: `<hook> — Xabier Ariznabarreta` (post) or `<page> — Xabier Ariznabarreta` (page).

By category:

- **tech** — Explain what and why in the title. Not clickbait. Prefer specific: `Cómo funciona X en Y`, `Implementando Z desde cero`.
- **research** — State the question or finding. `Ablation study: ¿Es X necesario?`, `Notas del paper Y`.
- **production** — Include the outcome. `Cómo rompí producción con X`, `Postmortem: fake token en agente Salesforce`.
- **meta** — First-person, concrete. `De producción a research, a los 19`.

## Meta description patterns (140-160 chars, unique per URL)

- Post description = frontmatter `excerpt`. Same rules apply.
- Never use the same description twice. Google deduplicates and picks one page.
- No brand suffix (already in title).
- Answer "what's this about + why should I read it" in one sentence.

## Frontmatter checklist per post

- [ ] `title` — max 55 chars (allows the ` — Xabier Ariznabarreta` suffix)
- [ ] `excerpt` — 140-160 chars, unique across the site
- [ ] `publishedAt` — YYYY-MM-DD (coerced to noon UTC)
- [ ] `updatedAt` — set on material revisions (typo fixes don't count)
- [ ] `category` — one of tech / research / production / meta
- [ ] `readingMinutes` — measured on final draft
- [ ] `icon` — Phosphor icon name (e.g. `ph:notebook-fill`)
- [ ] `color` — coral / mint / yellow / purple / blue
- [ ] `lang` — es / en
- [ ] `translationOf` — sibling slug when a translation exists
- [ ] `keywords` — 3-6 relevant terms (optional; used in `article:tag`)

## Internal linking

- Every post links back to `/about` in the byline (already automated).
- Every post links to at least ONE previous post in the body if relevant. Use anchor text that describes the target ("as I noted in <post title>"), not "click here".
- Every post has 3 related-posts cards at the end (same category + lang). Automated.

## Language pairs

- Post pairs (ES + EN) share the same slug ROOT — the `translationOf` frontmatter points to the sibling's ID.
- hreflang graph is automatic: self + counterpart + `x-default` (EN wins for x-default per current plan).
- Do NOT publish only in ES for research posts if the audience is international. Do publish EN-only for niche AI safety topics.

## Publication cadence

Aim: 1 post/month. Quality > cadence. If a post isn't ready, publish nothing — do not shortchange the notebook's editorial signal.

## Avoid

- Placeholder posts to "fill" categories. Google notices thin content.
- Keyword stuffing in titles or descriptions.
- AI tells: em-dashes overload, "Sure!", "Happy to", "In this article we will explore". If Claude wrote a draft, edit it to sound like Xabier.
- Republishing without `updatedAt` bump. Search engines re-crawl and demote content that looks stale.

## When adding a new post

1. Write draft in `src/content/posts/YYYY-MM-DD-slug.md` (or `.mdx`).
2. Fill frontmatter per checklist above.
3. `npm run dev` — preview at http://localhost:4321/posts/<slug>.
4. Check the OG card: http://localhost:4321/og/<slug>.png (should render 1200x630 with category color).
5. Commit + push. GitHub Action `indexnow.yml` auto-pings Bing on push.
6. In GSC → URL Inspection → paste the post URL → Request Indexing (once per post).
7. Update `MEMORY.md` / `x-brain` daily note per project workflow rules.

## Post-publish checklist (SEO-visible)

- Facebook Sharing Debugger — scrape URL, confirm OG card renders.
- LinkedIn Post Inspector — scrape URL. LinkedIn caches OG for ~7 days; get it right first time.
- Twitter/X Card Validator — confirm summary_large_image.
- Google Rich Results Test — Article eligible.
- Schema.org validator — Person + BlogPosting + BreadcrumbList all pass.
