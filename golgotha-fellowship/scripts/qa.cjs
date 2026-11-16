/**
 * QA sweep: screenshots at 390/768/1024/1440, horizontal-overflow check, tap-target
 * check, and axe-core WCAG 2.2 AA scan for every page.
 *
 *   npm run build && npx astro preview &      (or build:review)
 *   node scripts/qa.cjs [baseUrl] [outDir]
 */
const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const fs = require('node:fs');
const path = require('node:path');

const base = process.argv[2] || 'http://localhost:4321';
const out = path.resolve(process.argv[3] || 'qa');
const pages = ['/', '/new-here', '/about', '/beliefs', '/leadership', '/teachings', '/ministries', '/ministries/kids', '/ministries/youth', '/ministries/men', '/ministries/women', '/ministries/outreach', '/ministries/missions', '/events', '/prayer', '/contact', '/get-involved', '/give', '/thanks', '/404'];
const widths = [390, 768, 1024, 1440];

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const report = { overflow: [], smallTargets: [], axe: [], errors: [] };
  for (const w of widths) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 844 : 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' }); // reduce motion so scroll-reveal content is visible to the scan
    // Third-party map tiles are irrelevant to layout QA and may be blocked in CI.
    await ctx.route(/google\.com|youtube\.com|ytimg\.com/, (r) => r.abort());
    for (const p of pages) {
      const page = await ctx.newPage();
      page.on('pageerror', (e) => report.errors.push({ p, w, error: String(e) }));
      await page.goto(base + p, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const name = (p === '/' ? 'home' : p.slice(1).replace(/\//g, '_')) + `_${w}.png`;
      await page.screenshot({ path: path.join(out, name), fullPage: true });
      const m = await page.evaluate(() => {
        const de = document.documentElement;
        const small = [...document.querySelectorAll('a, button, input:not([type=hidden]), select, textarea')]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            const s = getComputedStyle(el);
            if (!r.width || !r.height || s.visibility === 'hidden' || el.closest('.sr-only, [aria-hidden=true], dialog:not([open])')) return false;
            // Inline links inside sentences are exempt under WCAG 2.5.8.
            if (el.tagName === 'A' && s.display === 'inline') return false;
            return r.height < 43.5 || r.width < 43.5;
          })
          .map((el) => `${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 40)}" ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`);
        return { overflow: de.scrollWidth - de.clientWidth, small };
      });
      if (m.overflow > 0) report.overflow.push({ p, w, px: m.overflow });
      if (m.small.length) report.smallTargets.push({ p, w, items: [...new Set(m.small)] });
      if (w === 390 || w === 1440) {
        const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
        for (const v of axe.violations) report.axe.push({ p, w, id: v.id, impact: v.impact, nodes: v.nodes.length, sample: v.nodes[0].html.slice(0, 160), help: v.help });
      }
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2));
  console.log(`overflow: ${report.overflow.length}  smallTargets: ${report.smallTargets.length}  axe: ${report.axe.length}  jsErrors: ${report.errors.length}`);
  console.log(JSON.stringify(report, null, 1).slice(0, 6000));
})();
