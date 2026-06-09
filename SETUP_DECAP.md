# Setup — Decap CMS (the WYSIWYG editor at `/admin/`)

End-to-end, this takes ~10 minutes. Two manual GitHub clicks, the rest happens via CLI.

## What you'll get

- A login button at <https://xabier-blog.vercel.app/admin/>
- Sign in with the GitHub account that owns this repo.
- A full WYSIWYG editor for posts: title, excerpt, category dropdown, color picker, draft toggle, rich-text body.
- "Save" → commits to `src/content/posts/<slug>.mdx` on `main`.
- Vercel rebuilds. New post is live in ~30 seconds.

## 1. Create the GitHub OAuth App (web — ~2 min)

Open: <https://github.com/settings/developers> → **New OAuth App**.

| Field | Value |
|---|---|
| Application name | `xabier-blog CMS` |
| Homepage URL | `https://xabier-blog.vercel.app` |
| Authorization callback URL | `https://xabier-blog.vercel.app/api/callback` |
| Application description | *(optional)* |

Click **Register application**.

On the next screen:

- **Copy the Client ID** (it'll look like `Iv1.abc123...`).
- Click **Generate a new client secret**, then **copy that too** before leaving the page — it's only shown once.

## 2. Add both values to Vercel env (CLI — ~1 min)

```bash
cd ~/IdeaProjects/xabier-blog
vercel env add OAUTH_GITHUB_CLIENT_ID production --scope xabilimon1s-projects
# paste Client ID, press enter

vercel env add OAUTH_GITHUB_CLIENT_SECRET production --scope xabilimon1s-projects
# paste Client Secret, press enter
```

If you also want to use the CMS on preview deployments and locally:

```bash
vercel env add OAUTH_GITHUB_CLIENT_ID preview --scope xabilimon1s-projects
vercel env add OAUTH_GITHUB_CLIENT_ID development --scope xabilimon1s-projects
vercel env add OAUTH_GITHUB_CLIENT_SECRET preview --scope xabilimon1s-projects
vercel env add OAUTH_GITHUB_CLIENT_SECRET development --scope xabilimon1s-projects
```

## 3. Redeploy so the new env vars apply

```bash
vercel deploy --prod --yes --scope xabilimon1s-projects
```

## 4. Use it

Open <https://xabier-blog.vercel.app/admin/>.

- Click **Login with GitHub**.
- A popup opens, you authorize "xabier-blog CMS" once, popup closes.
- You're in the editor. Create a post:
  - **Title** → "Why I'm pivoting from production agents to research at 19"
  - **Excerpt** → one-sentence summary
  - **Published at** → today
  - **Category** → Meta journey
  - **Reading minutes** → estimate
  - **Cover icon** → `ph:compass-fill` (any phosphor icon name)
  - **Cover color** → Purple
  - **Draft** → leave on while writing, flip off to publish
  - **Body** → write in the rich text editor or switch to raw Markdown
- Hit **Publish**. Decap commits the file to `main`.
- Vercel auto-rebuilds. Refresh `/blog` and `/posts/<slug>` in ~30 seconds.

## What this CMS does that vanilla `git push` doesn't

- Image uploads — drag into the body, file goes to `public/media/`, Decap inserts the correct path.
- Preview pane (rendered output side-by-side as you type).
- Field validation (category dropdown can't be misspelled; reading-minutes can't be negative).
- Drafts are visible in the admin index but excluded from the public site, RSS, and post URLs.
- View filters by category for finding existing posts.

## What still happens via git

- Everything else: layout changes, styles, components, design tweaks.
- The CMS is intentionally scoped to **content**, not the rest of the codebase.

## Security

- The OAuth callback verifies you have **push access** to this exact repo before handing you a token. Random GitHub users cannot use this CMS even if they find `/admin/`.
- The `state` parameter is cookie-bound to prevent CSRF.
- The token never lands in URL params, localStorage, or server logs.
- See `SECURITY.md` for the full threat model.

## Troubleshooting

- **"OAuth is not configured on the server."** → env vars are missing. Re-run step 2 + redeploy.
- **"You do not have push access to this repository."** → you signed in with the wrong GitHub account. Sign out of GitHub, sign back in as `@Xabilimon1`, try again.
- **"OAuth state mismatch."** → cookie was blocked or you took >10 min between clicking Login and authorizing. Just retry.
- **Popup doesn't close after authorizing.** → Some browsers block `window.close` from non-script-opened windows. Just close the popup manually; the token already arrived in the opener.
