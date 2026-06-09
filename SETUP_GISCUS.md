# Comments setup — Giscus + GitHub Discussions

Step-by-step guide to wire the comments UI in `post.html` to real GitHub Discussions in your Astro build. ~10 minutes end to end.

---

## 1. Pick the repo that will host comments

You need a **public GitHub repo** — Discussions is only available on public repos (or paid Enterprise). Two common setups:

- **A.** Use the blog's own repo (recommended) — `Xabilimon1/xabier-blog` or similar.
- **B.** Use a separate `xabier-blog-comments` repo dedicated to discussion storage.

Pick A unless you have a reason not to.

---

## 2. Enable Discussions on the repo

1. Open the repo on GitHub.
2. `Settings → General → Features`.
3. Tick **Discussions**.
4. Confirm. A `Discussions` tab now appears at the top of the repo.

---

## 3. Create the category Giscus will write to

1. Open the new `Discussions` tab.
2. Click the pencil/edit icon next to "Categories" in the sidebar.
3. **New category** → name it `Blog comments`, format **Announcement** (only maintainers can start threads — Giscus creates them for you when a reader first comments on a post).
4. Save.

> Format matters: Giscus needs `Announcement`, not `Open-ended`. With `Open-ended` anyone can spam new top-level threads.

---

## 4. Install the Giscus GitHub App

1. Go to <https://github.com/apps/giscus>.
2. **Install** → grant access to the repo you picked in step 1.

---

## 5. Get your Giscus config values

1. Open <https://giscus.app>.
2. **Repository** — paste `Xabilimon1/your-repo`. It checks the repo is public + has the app installed + Discussions enabled. You should see all three green ticks.
3. **Mapping** — choose `pathname`. Each blog post URL becomes its own Discussion thread.
4. **Category** — pick `Blog comments` (from step 3).
5. **Features** — enable: Reactions on main post, Emit discussion metadata. Keep "Lazy loading" on.
6. **Theme** — pick `custom` (we'll feed it our Bolby CSS).
7. Scroll to the bottom — you'll see a generated `<script>` snippet with `data-repo`, `data-repo-id`, `data-category`, `data-category-id`. **Copy those four values.** You need them in step 7.

---

## 6. Install the Astro integration

In the Astro project root:

```bash
npm install @giscus/react
```

(There's also a vanilla web-component `giscus`, but `@giscus/react` plays best with Astro's island model.)

---

## 7. Build the Giscus component

Create `src/components/Comments.astro` or `src/components/Comments.tsx`. Example using the React wrapper:

```tsx
// src/components/Comments.tsx
import Giscus from "@giscus/react";

export default function Comments() {
  return (
    <Giscus
      id="comments"
      repo="Xabilimon1/your-repo"           // step 5.2
      repoId="R_kgDOXXXXXX"                  // step 5.7
      category="Blog comments"               // step 5.4
      categoryId="DIC_kwDOXXXXXX"            // step 5.7
      mapping="pathname"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={`${import.meta.env.BASE_URL}giscus-bolby.css`}
      lang="en"
      loading="lazy"
    />
  );
}
```

Then in your post layout (`src/layouts/Post.astro`), drop it where the placeholder section currently lives in `post.html`:

```astro
---
import Comments from "../components/Comments.tsx";
---

<article>
  <slot />
</article>

<Comments client:visible />
```

`client:visible` defers loading until the reader scrolls down to the comments — keeps the post fast.

---

## 8. Wire the theme to match Bolby

The prototype uses these CSS vars. Save the snippet below as `public/giscus-bolby.css` so the iframe can fetch it (the `theme` URL must be reachable publicly).

```css
/* public/giscus-bolby.css — Bolby palette for Giscus iframe */
main {
  --color-prettylights-syntax-comment: #6c6b85;
  --color-prettylights-syntax-string: #26d9a3;

  --color-fg-default: #1a1a2e;
  --color-fg-muted: #6c6b85;
  --color-fg-subtle: #8e8da8;
  --color-canvas-default: #ffffff;
  --color-canvas-overlay: #ffffff;
  --color-canvas-inset: #faf9ff;
  --color-canvas-subtle: #faf9ff;
  --color-border-default: #ececf3;
  --color-border-muted: #ececf3;

  --color-accent-fg: #fc6471;
  --color-accent-emphasis: #fc6471;
  --color-accent-muted: rgba(252, 100, 113, 0.4);
  --color-accent-subtle: rgba(252, 100, 113, 0.08);

  --color-btn-bg: #fc6471;
  --color-btn-text: #ffffff;
  --color-btn-hover-bg: #ef4759;
  --color-btn-primary-bg: #fc6471;
  --color-btn-primary-hover-bg: #ef4759;
  --color-btn-primary-text: #ffffff;

  font-family: "Poppins", system-ui, sans-serif;
}

.gsc-comment-box-tabs button {
  font-family: "Poppins", system-ui, sans-serif;
}

.gsc-reactions {
  border-bottom: 1px solid var(--color-border-default);
}
```

This makes the embedded comment widget look continuous with the rest of the page.

---

## 9. Replace the prototype UI

In your Astro `Post.astro`, **delete** the entire `<section class="comments">…</section>` block from `post.html` and replace with `<Comments client:visible />`.

The Giscus iframe handles: auth (GitHub OAuth), comment storage (in Discussions), reactions, threading, moderation (delete/edit comments by going to the corresponding Discussion on GitHub), and email notifications.

---

## 10. Moderate from GitHub

- Every comment is a real GitHub Discussion message.
- Open the repo → Discussions → find the thread (named after the post URL) → reply, lock, delete, mark as answer.
- Spam: you can ban users at the org level.
- Backup: discussions are part of the repo and can be exported via the GraphQL API.

---

## When Giscus is NOT enough

- **You need Google / X login.** Giscus is GitHub-only. Switch to Supabase Auth + a `comments` table — ping me for that guide.
- **You want comment counts on the index page.** Giscus exposes a small JS helper (`emitMetadata="1"`) that emits a postMessage with the count; you can listen and render it on cards.
- **You want comments on something other than blog posts.** Same widget, just mount it. The `mapping` controls how threads are keyed.

---

## Quick checklist before going live

- [ ] Repo is public.
- [ ] Discussions enabled.
- [ ] `Blog comments` category exists with format `Announcement`.
- [ ] Giscus GitHub App installed on the repo.
- [ ] `repoId` and `categoryId` from giscus.app pasted into the component.
- [ ] `public/giscus-bolby.css` deployed alongside the site.
- [ ] `<Comments client:visible />` mounted in the post layout.
- [ ] Visit a post in incognito → click "Sign in with GitHub" → leave a test comment → confirm it shows up as a Discussion in the repo.

Done.
