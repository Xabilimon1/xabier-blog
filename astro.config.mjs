// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';

// Every page exports `prerender = true` to stay static-by-default; `output:
// 'server'` is kept so the Vercel adapter wires analytics + future endpoints
// without a config rewrite.
export default defineConfig({
  site: 'https://xabier-blog.vercel.app',
  output: 'server',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [mdx()],
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
});
