// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';

// Switched from `output: 'static'` to `output: 'server'` so the /api/auth +
// /api/callback endpoints are reliably emitted as serverless functions on
// Vercel. Every other page exports `prerender = true` to stay static-by-default.
export default defineConfig({
  site: 'https://xabier-blog.vercel.app',
  output: 'server',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [mdx()],
  adapter: vercel({
    webAnalytics: { enabled: false },
  }),
});
