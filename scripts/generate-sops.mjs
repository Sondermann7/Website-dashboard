// Generates the SOP library from data/cadence.json, data/procedures.json, and
// data/tool-reference.json, then mirrors the marketing/media half to Desktop/SOPs.
// Run via `npm run sops` after editing any of those three data files.
//
// Layout:
//   docs/sops/marketing-media/<department>/   - recurring + standing marketing/media SOPs
//   docs/sops/marketing-media/tools/          - one file per program/system actually in use
//   docs/sops/marketing-media/ai-assisted-work.md
//   docs/sops/internal-ops/                   - dashboard/repo-tooling procedures (OPS dept)
//                                                — repo-only, not mirrored to Desktop.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderAllSopPdfs } from './render-sop-pdfs.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CADENCE_PATH = path.join(ROOT, 'data', 'cadence.json');
const PROCEDURES_PATH = path.join(ROOT, 'data', 'procedures.json');
const TOOL_REFERENCE_PATH = path.join(ROOT, 'data', 'tool-reference.json');
const SOPS_DIR = path.join(ROOT, 'docs', 'sops');
const MM_DIR = path.join(SOPS_DIR, 'marketing-media');
const OPS_DIR = path.join(SOPS_DIR, 'internal-ops');
const DESKTOP_ROOT = path.join(process.env.USERPROFILE || 'C:/Users/Mikey', 'Desktop', 'SOPs');
const DESKTOP_MM = path.join(DESKTOP_ROOT, 'Marketing and Media');

const MM_DEPARTMENTS = {
  DISCOVERY: 'Technical & Site Health',
  CONTENT: 'Content & On-Page',
  LOCAL: 'Local SEO / Google Business Profile',
  REVIEWS: 'Reputation & Reviews',
  LINKS: 'Link Building & Outreach',
  RESEARCH: 'Competitive Intelligence & Measurement',
  GEO: 'AI Visibility (GEO)',
  EXTERIORS: 'Exteriors Line Launch',
  ADS: 'Paid Media & Landing Pages',
};
const OPS_DEPARTMENT = 'OPS';

const UNIVERSAL_CAUTIONS = [
  'Read-only by default. Do not touch the live website, GBP, ad accounts, or tracking unless this SOP explicitly calls for a change.',
  'Confirm a working, restorable backup exists before any live-site change — never assume one does.',
  'Mikey logs in. Never ask for or handle WordPress, hosting, GBP, ad-account, or plugin passwords.',
  'Never invent stats, service areas, local facts, certifications, rankings, or review counts. If a number is not verified, do not use it.',
];

const PHASE_CAUTIONS = {
  DISCOVERY: [
    'Findings only — do not noindex, redirect, or delete anything from a Discovery pass without logging it in the triage tracker and getting approval first.',
  ],
  CONTENT: [
    'Build in Draft/Preview. Nothing publishes without explicit approval.',
    'Avada/Fusion Builder is the page builder (not Elementor); Yoast is the SEO plugin (not Rank Math).',
    'One change at a time for redirects, templates, schema, or location pages — batching hides which change caused a regression.',
  ],
  LOCAL: [
    'Never use a CallRail dynamic tracking number as the public GBP/citation NAP phone number.',
    'Mikey approves and posts NAP/category/hours changes in Birdeye/GBP directly — draft, don’t publish.',
  ],
  REVIEWS: [
    'Draft replies for approval; do not post replies without sign-off, especially on negative reviews.',
    'Flag any review needing a phone call rather than a public reply.',
  ],
  LINKS: [
    'Verify a link actually went live (URL + anchor) before logging it as won — a promised link is not a won link.',
  ],
  RESEARCH: [
    'One AI response or one data pull is not proof of anything — log date, query/tool, source, and confidence level every time.',
  ],
  GEO: [
    'Schema must be verified in View Source (raw HTML), not the rendered DOM — AI crawlers generally skip JS execution.',
    'Separate search/index crawlers from training crawlers; verify any bot-specific claim against current official docs before stating it as fact.',
    'Treat AI-visibility work as a measurement system, not a promise that any engine will cite or rank Bartlett.',
  ],
  EXTERIORS: [
    'Build in Draft/Preview; publish one page at a time on approval.',
    'No cloned paragraphs across service pages — each must be genuinely differentiated.',
  ],
  ADS: [
    'Do not change GA4/GTM/CallRail/Meta tracking or form destinations without explicit approval.',
    'Verify test events with DebugView/Tag Assistant or a real test lead — don’t assume tracking works.',
    'Landing pages in /lp/ must be set to noindex.',
    'Meta domain verification and pixel wiring require Mikey to complete the actual steps in Meta Business Manager.',
  ],
  OPS: [
    'Never paste secrets, passwords, or API keys into a task title, note, or exec step — that content becomes part of a Cowork brief and this repo\'s files.',
  ],
};

function slugify(text) {
  const full = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (full.length <= 60) return full;
  return full.slice(0, 60).replace(/-[^-]*$/, '');
}

function cautionsFor(department) {
  return [...UNIVERSAL_CAUTIONS, ...(PHASE_CAUTIONS[department] || [])];
}

function renderSop(entry, deptLabel) {
  const cautions = cautionsFor(entry.ph);
  const steps = entry.exec && entry.exec.length ? entry.exec : ['(no execution steps recorded yet — see data/cadence.json)'];
  const lines = [];
  lines.push(`# ${entry.t}`);
  lines.push('');
  lines.push(`**Department:** ${deptLabel}`);
  lines.push(`**Frequency:** ${entry.freq}`);
  if (entry.where) lines.push(`**Where:** ${entry.where}`);
  lines.push('**Owner:** Marketing operator (Claude Code / Cowork session) — approved by Mikey');
  lines.push('');
  lines.push('## Objective');
  lines.push('');
  lines.push(entry.note || `Complete "${entry.t}" on the stated cadence and log the result.`);
  lines.push('');
  lines.push('## Procedure');
  lines.push('');
  steps.forEach((step, i) => lines.push(`${i + 1}. ${step}`));
  lines.push('');
  lines.push('## Cautionary Notes');
  lines.push('');
  cautions.forEach(c => lines.push(`- ${c}`));
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(`Source: promoted from \`data/cadence.json\` (id: \`${entry.id}\`). Edit the cadence entry, then regenerate with \`npm run sops\` — don’t hand-edit this file, it will be overwritten.`);
  lines.push('');
  return lines.join('\n');
}

function renderProcedure(proc, deptLabel) {
  const cautions = cautionsFor(proc.department);
  const lines = [];
  lines.push(`# ${proc.title}`);
  lines.push('');
  lines.push(`**Department:** ${deptLabel}`);
  lines.push('**Type:** Standing procedure (as-needed, not on a fixed cadence)');
  lines.push('**Owner:** Marketing operator (Claude Code / Cowork session) — approved by Mikey');
  lines.push('');
  lines.push('## Objective');
  lines.push('');
  lines.push(proc.objective);
  lines.push('');
  lines.push('## Procedure');
  lines.push('');
  proc.steps.forEach((step, i) => lines.push(`${i + 1}. ${step}`));
  lines.push('');
  lines.push('## Cautionary Notes');
  lines.push('');
  cautions.forEach(c => lines.push(`- ${c}`));
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(`Source: \`data/procedures.json\` (id: \`${proc.id}\`). ${proc.sourceNote || ''} Edit the procedures entry, then regenerate with \`npm run sops\` — don’t hand-edit this file, it will be overwritten.`);
  lines.push('');
  return lines.join('\n');
}

function renderToolReference(tool) {
  const lines = [];
  lines.push(`# ${tool.name}`);
  lines.push('');
  lines.push(`**Category:** ${tool.category}`);
  lines.push('');
  lines.push('## What it\'s for');
  lines.push('');
  lines.push(tool.purpose);
  lines.push('');
  lines.push('## How we use it');
  lines.push('');
  tool.howWeUseIt.forEach(item => lines.push(`- ${item}`));
  lines.push('');
  lines.push('## What\'s actually confirmed vs. still open');
  lines.push('');
  lines.push(tool.verifiedNotes);
  lines.push('');
  lines.push('## Cautionary Notes');
  lines.push('');
  (tool.cautions || []).forEach(c => lines.push(`- ${c}`));
  UNIVERSAL_CAUTIONS.forEach(c => lines.push(`- ${c}`));
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(`Source: \`data/tool-reference.json\` (id: \`${tool.id}\`). ${tool.sourceNote || ''} Edit the tool-reference entry, then regenerate with \`npm run sops\` — don’t hand-edit this file, it will be overwritten.`);
  lines.push('');
  return lines.join('\n');
}

function renderAiAssistedWork() {
  const lines = [];
  lines.push('# How AI-Assisted Work Fits Into Marketing & Media');
  lines.push('');
  lines.push('**Department:** Marketing & Media (cross-cutting)');
  lines.push('**Type:** Standing procedure — read this before treating any AI output as finished work.');
  lines.push('');
  lines.push('## Objective');
  lines.push('');
  lines.push('Explain how Claude Code / Cowork sessions actually get used to execute marketing and media');
  lines.push('tasks on this account, so anyone picking this up — including a future hire — knows what an AI');
  lines.push('session can be trusted to do on its own, and what always needs a human.');
  lines.push('');
  lines.push('## How it works today');
  lines.push('');
  lines.push('1. Every task in `data/tasks.json` / `data/cadence.json` carries an execution plan. Moving a');
  lines.push('   card to Doing on the dashboard only saves that state — it does not launch or open anything');
  lines.push('   automatically (an earlier auto-launch feature was removed 2026-07-16; see');
  lines.push('   `docs/cowork-contract.md` and `memory/decisions.md`).');
  lines.push('2. Handoff is manual: click "Copy Cowork brief" on the task, then paste it as the opening');
  lines.push('   message into a Claude Code or Cowork session yourself (see the Dashboard & Repo Operations');
  lines.push('   SOPs in `docs/sops/internal-ops/` for the exact steps). Findings get pasted back into the');
  lines.push('   dashboard\'s Memory tab or the verification queue.');
  lines.push('3. The brief itself carries the same non-negotiable rules regardless of which session runs it:');
  lines.push('   start read-only, work in Draft/Preview, one change at a time, never invent facts, never');
  lines.push('   handle passwords, stop and ask before anything live/irreversible.');
  lines.push('');
  lines.push('## What AI is trusted to do unsupervised');
  lines.push('');
  lines.push('- Read-only research, audits, and findings (GSC pulls, competitor research, AI-visibility checks).');
  lines.push('- Drafting: copy, replies, redirect maps, schema — anything shown for approval before it goes live.');
  lines.push('- Logging findings into `memory/log.md` or `data/verification-queue.json`.');
  lines.push('');
  lines.push('## What always needs Mikey');
  lines.push('');
  lines.push('- Publishing anything live, or any GBP/NAP/tracking/schema change that states a business fact.');
  lines.push('- Logging into WordPress, hosting, GBP, ad accounts, or any tool requiring a password.');
  lines.push('- Treating a single AI response (from this system or from ChatGPT/Perplexity/etc. during GEO');
  lines.push('  research) as proof of anything — it is a data point, not a verified fact.');
  lines.push('');
  lines.push('## Cautionary Notes');
  lines.push('');
  UNIVERSAL_CAUTIONS.forEach(c => lines.push(`- ${c}`));
  lines.push('- An AI session\'s own status report ("Done") is not verification — confirm the deliverable and');
  lines.push('  evidence yourself before moving a card to Done.');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('Source: `docs/cowork-contract.md`, `public/brief.mjs`, `memory/decisions.md`. Hand-maintained —');
  lines.push('not templated from a data file, since it describes a working relationship rather than a');
  lines.push('single tool or task.');
  lines.push('');
  return lines.join('\n');
}

function renderMarketingMediaReadme(entries, procedures, tools) {
  const mmProcedures = procedures.filter(p => p.department !== OPS_DEPARTMENT);
  const byPhase = {};
  entries.forEach(e => {
    byPhase[e.ph] = byPhase[e.ph] || [];
    byPhase[e.ph].push(e);
  });
  const procsByDept = {};
  mmProcedures.forEach(p => {
    procsByDept[p.department] = procsByDept[p.department] || [];
    procsByDept[p.department].push(p);
  });

  const lines = [];
  lines.push('# Marketing & Media SOPs');
  lines.push('');
  lines.push('Standard operating procedures for the marketing/media/SEO workflows on Bartlett Roofing &');
  lines.push('Exteriors. Generated from `data/cadence.json`, `data/procedures.json`, and');
  lines.push('`data/tool-reference.json` — run `npm run sops` after editing any of those to regenerate this');
  lines.push('index and every file. Mirrored to `Desktop/SOPs/Marketing and Media` for access outside this');
  lines.push('repo. Internal dashboard/repo-tooling procedures live separately in `docs/sops/internal-ops/`');
  lines.push('(not marketing/media work, and not mirrored to Desktop).');
  lines.push('');
  lines.push('## The bus-factor test');
  lines.push('');
  lines.push('Every SOP and tool-reference file here is written so that someone with no prior context —');
  lines.push('another hire, a different agency, a future AI session — could open it and understand not just');
  lines.push('*what* to do, but *which program* to do it in and *how that program fits into the bigger');
  lines.push('picture*. That is the bar: could a stranger pick this up cold and know how everything works?');
  lines.push('');
  lines.push('## What earns an SOP');
  lines.push('');
  lines.push('The test: **would someone else — or you in 3 months — need to reproduce this exact sequence');
  lines.push('of steps to get the same result?** If yes, it’s an SOP. If it’s a one-off judgment call with no');
  lines.push('repeatable path, it stays a `memory/log.md` entry instead.');
  lines.push('');
  lines.push('**Write one when the change/workflow is:**');
  lines.push('- A recurring workflow (anything with a `freq` in `data/cadence.json`)');
  lines.push('- A multi-click procedure in a specific tool that isn’t self-evident');
  lines.push('- Safety/reversal-critical (redirects, NAP edits, schema, backups, noindex)');
  lines.push('- A cross-tool or cross-person handoff that has to survive someone else picking it up');
  lines.push('');
  lines.push('**Skip it when it’s:**');
  lines.push('- A one-off content edit with no repeatable click-path');
  lines.push('- Exploratory research with no fixed method');
  lines.push('- A single decision with no procedure behind it');
  lines.push('- Already covered by an existing SOP — update that one instead of duplicating');
  lines.push('');
  lines.push('## AI-assisted work');
  lines.push('');
  lines.push('- [How AI-Assisted Work Fits Into Marketing & Media](ai-assisted-work.md)');
  lines.push('');
  lines.push('## Programs & tools reference');
  lines.push('');
  lines.push('One file per program/system actually used for marketing & media work — what it\'s for, how we');
  lines.push('use it here, and what\'s confirmed vs. still an open question. Not click-by-click tutorials for');
  lines.push('the tool in general — that\'s what the vendor\'s own docs are for.');
  lines.push('');
  tools.forEach(t => {
    lines.push(`- [${t.name}](tools/${slugify(t.name)}.md) — ${t.category}`);
  });
  lines.push('');
  lines.push('## Departments (by phase)');
  lines.push('');
  Object.entries(MM_DEPARTMENTS).forEach(([phase, dept]) => {
    const items = byPhase[phase] || [];
    const procs = procsByDept[phase] || [];
    lines.push(`### ${dept} (\`${phase}\`)`);
    lines.push('');
    if (items.length) {
      lines.push('**Recurring (from data/cadence.json):**');
      items.forEach(e => {
        const file = `${phase.toLowerCase()}/${e.freq}-${slugify(e.t)}.md`;
        lines.push(`- [${e.t}](${file}) — ${e.freq}`);
      });
      lines.push('');
    }
    if (procs.length) {
      lines.push('**Standing procedures (from data/procedures.json):**');
      procs.forEach(p => {
        const file = `${phase.toLowerCase()}/proc-${slugify(p.title)}.md`;
        lines.push(`- [${p.title}](${file})`);
      });
      lines.push('');
    }
    if (!items.length && !procs.length) {
      lines.push('_No SOPs yet for this department._');
      lines.push('');
    }
  });
  lines.push('## Non-recurring tasks');
  lines.push('');
  lines.push('One-off tasks in `data/tasks.json` (launches, migrations, one-time fixes) do not auto-generate');
  lines.push('an SOP here. If a one-off task turns out to establish a repeatable procedure (you catch');
  lines.push('yourself re-deriving the same steps a second time), promote it manually: add a cadence-style');
  lines.push('entry to `data/cadence.json` if it’s truly recurring, or hand-write a file in the relevant');
  lines.push('department folder following the same Objective / Procedure / Cautionary Notes shape.');
  lines.push('');
  lines.push('## Sales (not generated here)');
  lines.push('');
  lines.push('SalesTrak\'s full sales-rep procedure (pin creation, workflow stages, Rooflink handoff) lives in');
  lines.push('the separate *Salestrak Desktop SOP.pdf* Mikey provided — that is the sales-team source of truth.');
  lines.push('The [SalesTrak tool-reference entry](tools/salestrak.md) here only covers what marketing needs');
  lines.push('for lead-source attribution reconciliation.');
  lines.push('');
  return lines.join('\n');
}

function renderInternalOpsReadme(procedures) {
  const opsProcedures = procedures.filter(p => p.department === OPS_DEPARTMENT);
  const lines = [];
  lines.push('# Internal Ops (Dashboard & Repo Tooling)');
  lines.push('');
  lines.push('Standing procedures for operating this dashboard/repo itself — not marketing or media content');
  lines.push('work. Generated from `data/procedures.json` (entries with `department: "OPS"`). Repo-only —');
  lines.push('not mirrored to Desktop, since these describe internal tooling rather than marketing/media');
  lines.push('workflows.');
  lines.push('');
  opsProcedures.forEach(p => {
    lines.push(`- [${p.title}](proc-${slugify(p.title)}.md)`);
  });
  lines.push('');
  return lines.join('\n');
}

function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDirRecursive(s, d);
    else fs.copyFileSync(s, d);
  }
}

function main() {
  const entries = JSON.parse(fs.readFileSync(CADENCE_PATH, 'utf8'));
  const procedures = fs.existsSync(PROCEDURES_PATH)
    ? JSON.parse(fs.readFileSync(PROCEDURES_PATH, 'utf8'))
    : [];
  const tools = fs.existsSync(TOOL_REFERENCE_PATH)
    ? JSON.parse(fs.readFileSync(TOOL_REFERENCE_PATH, 'utf8'))
    : [];

  fs.rmSync(SOPS_DIR, { recursive: true, force: true });
  fs.mkdirSync(MM_DIR, { recursive: true });
  fs.mkdirSync(OPS_DIR, { recursive: true });

  // Marketing & media: recurring cadence SOPs
  entries.forEach(entry => {
    const dir = path.join(MM_DIR, entry.ph.toLowerCase());
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `${entry.freq}-${slugify(entry.t)}.md`);
    fs.writeFileSync(file, renderSop(entry, MM_DEPARTMENTS[entry.ph] || entry.ph), 'utf8');
  });

  // Marketing & media vs. internal-ops standing procedures
  procedures.forEach(proc => {
    if (proc.department === OPS_DEPARTMENT) {
      const file = path.join(OPS_DIR, `proc-${slugify(proc.title)}.md`);
      fs.writeFileSync(file, renderProcedure(proc, 'Dashboard & Repo Operations'), 'utf8');
    } else {
      const dir = path.join(MM_DIR, proc.department.toLowerCase());
      fs.mkdirSync(dir, { recursive: true });
      const file = path.join(dir, `proc-${slugify(proc.title)}.md`);
      fs.writeFileSync(file, renderProcedure(proc, MM_DEPARTMENTS[proc.department] || proc.department), 'utf8');
    }
  });

  // Tools & programs reference (marketing & media only)
  const toolsDir = path.join(MM_DIR, 'tools');
  fs.mkdirSync(toolsDir, { recursive: true });
  tools.forEach(tool => {
    const file = path.join(toolsDir, `${slugify(tool.name)}.md`);
    fs.writeFileSync(file, renderToolReference(tool), 'utf8');
  });

  // AI-assisted-work doc (marketing & media)
  fs.writeFileSync(path.join(MM_DIR, 'ai-assisted-work.md'), renderAiAssistedWork(), 'utf8');

  // Indexes
  fs.writeFileSync(path.join(MM_DIR, 'README.md'), renderMarketingMediaReadme(entries, procedures, tools), 'utf8');
  fs.writeFileSync(path.join(OPS_DIR, 'README.md'), renderInternalOpsReadme(procedures), 'utf8');

  // PDF copies alongside every .md, so they're readable without a markdown viewer.
  const { count: pdfCount } = renderAllSopPdfs();

  // Mirror marketing & media (only) to Desktop/SOPs/Marketing and Media
  fs.rmSync(DESKTOP_ROOT, { recursive: true, force: true });
  copyDirRecursive(MM_DIR, DESKTOP_MM);

  console.log(`Generated ${entries.length} recurring SOP(s), ${procedures.length} standing procedure(s), ${tools.length} tool-reference doc(s), ${pdfCount} PDF(s).`);
  console.log(`Marketing & Media mirrored to ${DESKTOP_MM}`);
  console.log(`Internal ops kept repo-only at ${path.relative(ROOT, OPS_DIR)}`);
}

main();
