// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Production domain. Used for canonical URLs, sitemap and Open Graph.
const SITE = process.env.SITE_URL ?? 'https://www.golgothafellowship.org';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'auto' },
  integrations: [
    react(),
    sitemap({ filter: (page) => !/\/(thanks|404)$/.test(page) }),
  ],
  vite: { plugins: [tailwindcss()] },
});
