// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://xabier.me',
  trailingSlash: 'never',
  output: 'server',
  build: { format: 'file' },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-ES', en: 'en-US' },
      },
      filter: (page) =>
        !page.includes('/drafts/') && !page.includes('/404'),
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
  adapter: vercel(),
});
