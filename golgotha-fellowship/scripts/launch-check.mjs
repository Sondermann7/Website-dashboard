#!/usr/bin/env node
/**
 * Launch gate. Run `npm run launch-check` before pointing DNS at the new site.
 * Exits 1 while any blocker remains. It checks facts in the repo; it cannot check
 * approvals the church gives verbally - see docs/LAUNCH_REPORT.md for the full list.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, p));
const anyFile = (dir, re) => exists(dir) && fs.readdirSync(path.join(root, dir)).some((f) => re.test(f));

const blockers = [];
const warnings = [];
const ok = [];
const check = (pass, list, msg, good) => (pass ? ok.push(good ?? msg) : list.push(msg));

const cfg = read('src/config/church.ts');
const beliefs = read('src/content/beliefs/statement.md');
const status = beliefs.match(/^approvalStatus:\s*(\w+)/m)?.[1];

check(status === 'approved', blockers, `Statement of Faith is "${status}". Paste the official text verbatim into src/content/beliefs/statement.md and get pastoral approval.`, 'Statement of Faith migrated and approved.');
check(!/giving:\s*\{[\s\S]*?url:\s*null/.test(cfg), blockers, 'Giving link not set (giving.url in src/config/church.ts).', 'Giving link set.');
check(anyFile('src/assets/brand', /^golgotha-logo\.svg$/i), blockers, 'Logo missing (src/assets/brand/golgotha-logo.svg).', 'Logo present (vector traced from the church artwork; swap in the original file when supplied).');
check(anyFile('src/assets/brand', /^calvary-dove\.svg$/i), warnings, 'Calvary Chapel dove not supplied (src/assets/brand/calvary-dove.svg). No dove is shown.', 'Calvary Chapel dove present.');
check(anyFile('src/assets/photos', /^hero\./i), warnings, 'No hero photo (src/assets/photos/hero.jpg). Homepage hero is plain navy. The design depends on real photos: see src/assets/photos/README.md.', 'Hero photo present.');
check(!/channelId:\s*null/.test(cfg), warnings, 'YouTube channel ID not set: "Latest teaching" links to the channel instead of showing the newest video.', 'YouTube channel ID set.');

const count = (p, re) => (read(p).match(re) ?? []).length;
const confirm = count('src/config/church.ts', /status:\s*'confirm'/g) + count('src/content/leadership/leaders.yaml', /status:\s*confirm/g) + count('src/content/visitor/faq.yaml', /status:\s*confirm/g) +
  fs.readdirSync(path.join(root, 'src/content/ministries')).filter((f) => /status:\s*confirm/.test(read(`src/content/ministries/${f}`))).length;
const todo = count('src/content/visitor/faq.yaml', /status:\s*todo/g);
check(confirm === 0, warnings, `${confirm} item(s) still marked "confirm" (shown publicly, awaiting church sign-off). Change each to "verified" once confirmed.`, 'No items awaiting confirmation.');
check(todo === 0, warnings, `${todo} visitor question(s) still "todo" (parking/entrance, service length). A stand-in answer is shown.`, 'All visitor questions answered.');

if (exists('dist')) {
  const html = [];
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.html') && html.push(path.join(d, e.name))));
  walk(path.join(root, 'dist'));
  const leaked = html.filter((f) => /TODO_VERIFY|data-review-flag|REVIEW BUILD/.test(fs.readFileSync(f, 'utf8')));
  check(leaked.length === 0, blockers, `dist/ is a REVIEW build (${leaked.length} pages contain review flags). Run "npm run build" before deploying to production.`, 'dist/ contains no review flags.');
  check(/Sitemap:/.test(fs.readFileSync(path.join(root, 'dist/robots.txt'), 'utf8')), blockers, 'dist/robots.txt blocks search engines (review build).', 'robots.txt allows indexing and lists the sitemap.');
} else warnings.push('No dist/ folder. Run "npm run build" first to check the built output.');

const print = (title, items, mark) => items.length && console.log(`\n${title}\n${items.map((i) => `  ${mark} ${i}`).join('\n')}`);
print('PASSED', ok, '✓');
print('WARNINGS (review, not blocking)', warnings, '!');
print('BLOCKERS (must fix before launch)', blockers, '✗');
console.log(`\n${blockers.length === 0 ? 'Ready for launch approval.' : `${blockers.length} blocker(s) remain. Do not launch.`}\n`);
process.exit(blockers.length === 0 ? 0 : 1);
