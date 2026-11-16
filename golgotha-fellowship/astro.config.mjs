// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Production domain. Used for canonical URLs, sitemap and Open Graph.
const SITE = process.env.SITE_URL ?? 'https://www.golgothafellowship.org';

/**
 * Preview-only stock stand-ins (src/assets/standins) must never reach a public build.
 * The pages only reference them when PUBLIC_STANDINS=true (npm run build:preview), but
 * the bundler still copies the files into dist/. This integration deletes those copies
 * from every other build, matching by file content so a real photo is never removed.
 */
const standinsEnabled = process.env.PUBLIC_STANDINS === 'true';
const removeStandins = {
  name: 'remove-preview-standins',
  hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      if (standinsEnabled) return;
      const sha = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');
      const srcDir = fileURLToPath(new URL('./src/assets/standins/', import.meta.url));
      if (!existsSync(srcDir)) return;
      const blocked = new Set(readdirSync(srcDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).map((f) => sha(join(srcDir, f))));
      const outDir = join(fileURLToPath(dir), '_astro');
      if (!blocked.size || !existsSync(outDir)) return;
      let removed = 0;
      for (const f of readdirSync(outDir)) {
        if (/\.(jpe?g|png|webp)$/i.test(f) && blocked.has(sha(join(outDir, f)))) { rmSync(join(outDir, f)); removed++; }
      }
      logger.info(`Removed ${removed} preview-only stand-in image(s) from the public build.`);
    },
  },
};

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'auto' },
  integrations: [
    react(),
    sitemap({ filter: (page) => !/\/(thanks|404)$/.test(page) }),
    removeStandins,
  ],
  vite: { plugins: [tailwindcss()] },
});
