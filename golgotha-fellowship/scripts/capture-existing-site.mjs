/**
 * Real-site screenshot, visual-style and media inventory for Golgotha Fellowship.
 * Run on a machine with internet access.
 *
 * npm install -D playwright
 * npx playwright install chromium
 * node capture_existing_site.mjs
 *
 * Outputs are factual screenshots of the website at capture time, not AI renders.
 */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.join(process.cwd(), 'reference');
const shots = path.join(root, 'screenshots');
await fs.mkdir(shots, { recursive: true });

const urls = {
  home: 'https://www.golgothafellowship.org/',
  beliefs: 'https://www.golgothafellowship.org/what-we-believe',
  kids: 'https://www.golgothafellowship.org/feed-my-lambs',
  youth: 'https://www.golgothafellowship.org/called-for-a-purpose',
  leadership: 'https://www.golgothafellowship.org/team-3',
  teachings: 'https://www.golgothafellowship.org/about-6',
  involvement: 'https://www.golgothafellowship.org/contact-8',
  missions: 'https://www.golgothafellowship.org/missions',
};
const devices = [
  { name: 'desktop', viewport: { width: 1440, height: 900 }, isMobile: false },
  { name: 'mobile', viewport: { width: 390, height: 844 }, isMobile: true },
];
const browser = await chromium.launch({ headless: true });
const styleAudit = [];
const mediaAudit = [];

for (const device of devices) {
  const ctx = await browser.newContext({
    viewport: device.viewport,
    deviceScaleFactor: 1,
    isMobile: device.isMobile,
    hasTouch: device.isMobile,
  });
  for (const [name, url] of Object.entries(urls)) {
    const page = await ctx.newPage();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(3000);
      await page.evaluate(async () => {
        const step = Math.max(350, Math.floor(window.innerHeight * 0.7));
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise(r => setTimeout(r, 70));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(1700);
      await page.screenshot({ path: path.join(shots, `${name}_${device.name}.png`), fullPage: true, animations: 'disabled' });
      const facts = await page.evaluate(() => {
        const groups = {};
        const pick = (els, field) => [...els].map(el => getComputedStyle(el)[field]).filter(Boolean);
        const tally = xs => Object.entries(xs.reduce((m, x) => { m[x] = (m[x] || 0) + 1; return m; }, {})).sort((a,b) => b[1] - a[1]).slice(0, 12);
        for (const t of ['body','header','nav','h1','h2','p','a','button']) {
          const els = document.querySelectorAll(t);
          groups[t] = { textColors: tally(pick(els, 'color')), backgroundColors: tally(pick(els, 'backgroundColor')), fonts: tally(pick(els, 'fontFamily')) };
        }
        const images = [...document.querySelectorAll('img')].map(img => ({
          alt: img.alt || '', src: img.currentSrc || img.src || '', width: img.naturalWidth, height: img.naturalHeight,
        }));
        return { title: document.title, canonical: document.querySelector('link[rel="canonical"]')?.href || '', height: document.documentElement.scrollHeight, groups, images };
      });
      styleAudit.push({ page: name, device: device.name, url: page.url(), title: facts.title, pageHeight: facts.height, styleSamples: facts.groups });
      if (device.name === 'desktop') mediaAudit.push({ page: name, images: facts.images });
      console.log('Captured:', name, device.name);
    } catch (err) {
      styleAudit.push({ page: name, device: device.name, url, error: String(err) });
      console.error('Capture failed:', name, device.name, String(err));
    } finally { await page.close(); }
  }
  await ctx.close();
}
await browser.close();
await fs.writeFile(path.join(root, 'site_style_audit.json'), JSON.stringify(styleAudit, null, 2));
await fs.writeFile(path.join(root, 'site_media_inventory.json'), JSON.stringify(mediaAudit, null, 2));
console.log('Done. Review reference/screenshots/ and style/media JSON.');
