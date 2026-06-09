# xabier-blog

Source for [xabier.dev](https://xabier.dev) — personal research notebook.

Friendly, colorful, professional. Astro + Tailwind + MDX. Design inspired by Bolby template adapted for research-blog purpose.

## Stack

- Astro 5 (static)
- Tailwind CSS 4 (Vite plugin)
- MDX (posts with embeddable components)
- Vercel (hosting)

## Run

```sh
npm install
npm run dev      # localhost:4321
npm run build    # static output to ./dist
npm run preview  # serve build locally
```

## Structure

```
src/
├── components/      ← Hero, AboutMe, Now, Projects, LatestPosts, Contact, Sidebar
│   └── decorations/ ← Scattered SVG shapes (Bolby aesthetic)
├── layouts/         ← Layout.astro (HTML shell)
├── pages/           ← Routes
├── content/posts/   ← MDX post sources (to populate)
└── styles/global.css ← Tailwind + theme tokens
```

## Design tokens

| Token | Value | Use |
|-------|-------|-----|
| `--color-cream` | `#F8F8F7` | Background |
| `--color-ink` | `#2D2D2D` | Body text |
| `--color-coral` | `#FF5757` | Primary accent / CTAs |
| `--color-purple` | `#A78BFA` | Research category |
| `--color-yellow` | `#FCD34D` | Production category |
| `--color-pink` | `#F472B6` | Writing category |
| `--color-mute` | `#9CA3AF` | Secondary text |

## License

MIT.
