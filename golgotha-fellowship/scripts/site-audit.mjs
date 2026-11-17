#!/usr/bin/env node
/**
 * Full functional audit of the built site, run against Cloudflare's local server so
 * redirects, headers and the form function behave exactly as in production.
 *
 *   npm run build && npx wrangler pages dev dist --port 8788 &
 *   node scripts/site-audit.mjs [baseUrl]
 *
 * Checks: every internal link and #anchor resolves; every old-site URL redirects to the
 * right page; phone, email, address and service times agree with src/config/church.ts
 * on every page; no stale or placeholder text; one H1, unique title and description,
 * correct canonical on each page; sitemap and robots; form endpoint behaviour;
 * mobile menu, skip link and quick-action bar.
 */
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');

const BASE = process.argv[2] || 'http://127.0.0.1:8788';
const SITE = 'https://www.golgothafellowship.org';
const fails = [];
const notes = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); return cond; };

const get = (path, opts = {}) => fetch(BASE + path, { redirect: 'manual', ...opts });
async function follow(path, max = 5) {
  let p = path, hops = [];
  for (let i = 0; i < max; i++) {
    const r = await get(p);
    hops.push(r.status);
    if (r.status >= 300 && r.status < 400) { p = new URL(r.headers.get('location'), BASE + p).pathname; continue; }
    return { status: r.status, path: p, hops, html: r.status === 200 ? await r.text() : '' };
  }
  return { status: 0, path: p, hops, html: '' };
}

// ---------- 1. Redirects from the old site --------------------------------
const legacy = {
  '/home': '/', '/what-we-believe': '/beliefs', '/feed-my-lambs': '/ministries/kids', '/called-for-a-purpose': '/ministries/youth',
  '/team-3': '/leadership', '/about-6': '/teachings', '/contact-8': '/get-involved', '/missions': '/ministries/missions', '/about-1': '/about',
  '/visit': '/new-here', '/directions': '/location', '/map': '/location', '/sermons': '/teachings', '/sermons/2019/some-old-sermon': '/teachings',
  '/donate': '/give', '/giving': '/give', '/staff': '/leadership', '/pastor': '/pastor-marty', '/kids': '/ministries/kids', '/youth': '/ministries/youth', '/prayer-request': '/prayer',
};
const redirectRows = [];
for (const [from, to] of Object.entries(legacy)) {
  for (const f of from.includes('/sermons/') ? [from] : [from, from + '/']) {
    if (f === '//') continue;
    const r = await follow(f);
    const good = r.status === 200 && r.path === to;
    redirectRows.push(`${good ? 'OK  ' : 'FAIL'} ${f.padEnd(34)} -> ${r.path} (${r.hops.join(' > ')})`);
    ok(good, `Redirect ${f} should land on ${to}, got ${r.path} ${r.hops.join('>')}`);
  }
}

// ---------- 2. Pages from the sitemap -------------------------------------
const sm = await (await get('/sitemap-0.xml')).text();
const pages = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/(.)\/$/, '$1'));
ok(pages.length >= 20, `Sitemap lists only ${pages.length} pages`);
for (const must of ['/', '/new-here', '/location', '/pastor-marty', '/beliefs', '/give', '/prayer', '/contact']) ok(pages.includes(must), `Sitemap missing ${must}`);
const robots = await (await get('/robots.txt')).text();
ok(/Sitemap: https:\/\/www\.golgothafellowship\.org\/sitemap-index\.xml/.test(robots) && !/Disallow: \/\s*$/m.test(robots), 'robots.txt does not allow indexing / list the sitemap');

const PHONE = '208-572-3317', TEL = 'tel:+12085723317', EMAIL = 'info@golgothafellowship.org';
const banned = [/Greenhurst/i, /12th Ave/i, /Sunday'?s? 10 ?AM/i, /TODO_VERIFY/, /REVIEW BUILD/, /lorem ipsum/i, /\bundefined\b/, /\bNaN\b/, /\[object Object\]/, /Photo needed/, /208[-. ]?572[-. ]?3318/, /info@golgotha\.org/];
const titles = new Map(), descs = new Map();
const internal = new Map(); // href -> [pages]
const external = new Map();
const pageIds = new Map();

for (const p of [...pages, '/thanks', '/404']) {
  const r = await get(p);
  const html = await r.text();
  if (p !== '/404') ok(r.status === 200, `${p} returned ${r.status}`);
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  const canon = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? '';
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  ok(title.length > 10, `${p}: missing title`);
  ok(desc.length > 50, `${p}: description too short`);
  ok(h1s === 1, `${p}: has ${h1s} H1 headings`);
  if (p !== '/404' && p !== '/thanks') {
    ok(canon === SITE + (p === '/' ? '/' : p), `${p}: canonical is ${canon}`);
    if (titles.has(title)) fails.push(`${p}: duplicate title with ${titles.get(title)}`); titles.set(title, p);
    if (descs.has(desc)) fails.push(`${p}: duplicate description with ${descs.get(desc)}`); descs.set(desc, p);
  }
  for (const re of banned) ok(!re.test(html), `${p}: contains stale/placeholder text ${re}`);
  // facts: every tel link must be the church phone; every mailto the church or youth email
  for (const m of html.matchAll(/href="(tel:[^"]+)"/g)) ok(m[1] === TEL, `${p}: wrong phone link ${m[1]}`);
  for (const m of html.matchAll(/href="mailto:([^"?]+)/g)) ok([EMAIL, 'youth@golgothafellowship.org'].includes(m[1]), `${p}: unexpected email ${m[1]}`);
  ok(html.includes(PHONE), `${p}: phone number not shown`);
  ok(html.includes('1404 1st Street South'), `${p}: address not shown`);
  ok(/8:30 AM and 10:30 AM/.test(html), `${p}: Sunday times not shown`);
  pageIds.set(p, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  for (const m of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
    const h = m[1].replace(/&amp;/g, '&');
    if (/^(https?:)?\/\//.test(h)) { (external.get(h) ?? external.set(h, new Set()).get(h)).add(p); continue; }
    if (/^(tel|mailto):/.test(h)) continue;
    (internal.get(h) ?? internal.set(h, new Set()).get(h)).add(p);
  }
}

// ---------- 3. Every internal link and anchor -----------------------------
const linkRows = [];
for (const [href, from] of internal) {
  const [path0, hash] = href.split('#');
  const base = [...from][0];
  const path = path0 === '' ? base : path0;
  const r = await follow(path);
  let good = r.status === 200;
  if (good && hash) {
    const ids = pageIds.get(r.path) ?? new Set([...r.html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
    good = ids.has(hash);
  }
  linkRows.push(`${good ? 'OK  ' : 'FAIL'} ${href}`);
  ok(good, `Broken internal link ${href} (on ${[...from].slice(0, 3).join(', ')}) -> ${r.status} ${r.path}`);
}

// ---------- 4. External links: shape check (network to them is blocked here) ---
const allowedHosts = ['www.google.com', 'maps.apple.com', 'www.youtube.com', 'www.facebook.com', 'www.instagram.com', 'www.amazon.com', 'www.audible.com', 'podcasts.apple.com', 'www.tvmen.org', 'www.revelationroundtable.com', 'members.nampa.com'];
for (const [h] of external) {
  const host = new URL(h, SITE).host;
  ok(h.startsWith('https://'), `External link not https: ${h}`);
  ok(allowedHosts.includes(host), `Unexpected external host ${host} (${h})`);
}
notes.push(`${external.size} distinct external links (hosts: ${[...new Set([...external.keys()].map((h) => new URL(h).host))].join(', ')}). Reachability not testable from this environment.`);

// ---------- 5. Forms endpoint ---------------------------------------------
const fd = new FormData(); fd.set('form', 'prayer'); fd.set('name', 'Audit Test'); fd.set('email', 'audit@example.com'); fd.set('message', 'test');
const fr = await fetch(BASE + '/api/forms', { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
const fj = await fr.json().catch(() => ({}));
ok(fr.status === 503 && /208-572-3317/.test(fj.error ?? ''), `Unconfigured form endpoint should refuse with a call/email message, got ${fr.status}`);
const bad = new FormData(); bad.set('form', 'prayer'); bad.set('name', ''); bad.set('email', 'x');
ok((await fetch(BASE + '/api/forms', { method: 'POST', body: bad, headers: { Accept: 'application/json' } })).status === 422, 'Invalid form input should return 422');
ok((await get('/api/forms')).status === 405, 'GET /api/forms should be 405');

// ---------- 6. Headers -----------------------------------------------------
const hr = await get('/');
for (const hname of ['content-security-policy', 'x-content-type-options', 'referrer-policy', 'strict-transport-security']) ok(hr.headers.get(hname), `Missing security header ${hname}`);
ok((await get('/og-default.png')).status === 200, 'Social preview image missing');
ok((await get('/favicon.svg')).status === 200, 'Favicon missing');
ok((await get('/this-page-does-not-exist')).status === 404, 'Unknown pages should return 404');

// ---------- 7. Browser interactions ---------------------------------------
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
await ctx.route(/google\.com|youtube|ytimg/, (r) => r.abort());
const pg = await ctx.newPage();
const jsErrors = []; pg.on('pageerror', (e) => jsErrors.push(String(e)));
await pg.goto(BASE + '/');
await pg.keyboard.press('Tab');
ok((await pg.evaluate(() => document.activeElement.textContent.trim())) === 'Skip to main content', 'Skip link is not the first tab stop');
await pg.click('#menu-open');
ok(await pg.evaluate(() => document.getElementById('mobile-menu').open), 'Mobile menu does not open');
const menuLinks = await pg.$$eval('#mobile-menu a', (as) => as.map((a) => a.getAttribute('href')));
for (const need of ['/', '/new-here', '/about', '/teachings', '/ministries', '/events', '/give', '/location', '/prayer', '/contact']) ok(menuLinks.includes(need), `Mobile menu missing ${need}`);
await pg.keyboard.press('Escape');
ok(!(await pg.evaluate(() => document.getElementById('mobile-menu').open)), 'Escape does not close the mobile menu');
await pg.click('#menu-open'); await pg.click('#mobile-menu a[href="/location"]'); await pg.waitForLoadState('load');
ok(new URL(pg.url()).pathname === '/location', 'Mobile menu link does not navigate');
const bar = await pg.$$eval('nav[aria-label="Quick actions"] a', (as) => as.map((a) => a.getAttribute('href')));
ok(bar.length === 4 && bar[0] === '/new-here' && bar[1] === TEL && /google\.com\/maps\/dir/.test(bar[2]) && bar[3] === '/teachings', `Quick-action bar links wrong: ${bar.join(' | ')}`);
const map = await pg.$eval('iframe', (f) => f.src);
ok(/google\.com\/maps\?q=1404%201st%20Street%20South/.test(map), `Location map is not pinned to the address: ${map}`);
for (const p of ['/prayer', '/contact', '/get-involved']) {
  await pg.goto(BASE + p);
  ok(await pg.$(`a[href="${TEL}"]`), `${p}: no call button while forms are off`);
  ok(await pg.$(`a[href^="mailto:${EMAIL}"]`), `${p}: no email button while forms are off`);
}
ok(jsErrors.length === 0, `JavaScript errors: ${jsErrors.join(' | ')}`);
await browser.close();

// ---------- Report ---------------------------------------------------------
console.log('\nREDIRECTS'); console.log(redirectRows.join('\n'));
console.log(`\nINTERNAL LINKS: ${linkRows.length} distinct, ${linkRows.filter((l) => l.startsWith('FAIL')).length} broken`);
console.log(`PAGES CHECKED: ${pages.length + 2}`);
console.log('\nNOTES'); for (const n of notes) console.log('  - ' + n);
console.log(fails.length ? `\nFAILURES (${fails.length})\n  - ${fails.join('\n  - ')}` : '\nALL CHECKS PASSED');
process.exit(fails.length ? 1 : 0);
