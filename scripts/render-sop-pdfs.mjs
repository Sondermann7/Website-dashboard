// Renders a .pdf copy alongside every .md file generate-sops.mjs produces, so they're readable
// without a markdown viewer. Uses a locally installed Chromium browser (Edge or Chrome) in
// --headless --print-to-pdf mode — no npm dependency, no third-party code pulled in.
// Run via `npm run sops` (it calls this automatically) or standalone: `npm run sop-pdfs`.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOPS_DIR = path.join(ROOT, 'docs', 'sops');

const BROWSER_CANDIDATES = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
];

function findBrowser() {
  const found = BROWSER_CANDIDATES.find(p => fs.existsSync(p));
  if (!found) throw new Error('No local Edge or Chrome install found for headless PDF rendering.');
  return found;
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inlineMarkdown(text) {
  let out = escapeHtml(text);
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // relative .md links aren't valid outside the repo — keep the label, drop the href
  return out;
}

function mdToHtml(markdown, title) {
  const lines = markdown.split('\n');
  const body = [];
  let listMode = null; // 'ul' | 'ol' | null

  function closeList() {
    if (listMode) { body.push(`</${listMode}>`); listMode = null; }
  }

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^# /.test(line)) { closeList(); body.push(`<h1>${inlineMarkdown(line.slice(2))}</h1>`); continue; }
    if (/^## /.test(line)) { closeList(); body.push(`<h2>${inlineMarkdown(line.slice(3))}</h2>`); continue; }
    if (/^---\s*$/.test(line)) { closeList(); body.push('<hr>'); continue; }
    if (/^- /.test(line)) {
      if (listMode !== 'ul') { closeList(); body.push('<ul>'); listMode = 'ul'; }
      body.push(`<li>${inlineMarkdown(line.slice(2))}</li>`);
      continue;
    }
    if (/^\d+\. /.test(line)) {
      if (listMode !== 'ol') { closeList(); body.push('<ol>'); listMode = 'ol'; }
      body.push(`<li>${inlineMarkdown(line.replace(/^\d+\.\s/, ''))}</li>`);
      continue;
    }
    if (line.trim() === '') { closeList(); continue; }
    closeList();
    body.push(`<p>${inlineMarkdown(line)}</p>`);
  }
  closeList();

  return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
<style>
  body { font-family: Georgia, 'Times New Roman', serif; color: #1a1a1a; max-width: 7.5in; margin: 0 auto; padding: 0.4in 0; line-height: 1.5; font-size: 12px; }
  h1 { font-family: Arial, sans-serif; font-size: 22px; border-bottom: 2px solid #2c3e50; padding-bottom: 6px; margin-bottom: 14px; }
  h2 { font-family: Arial, sans-serif; font-size: 15px; color: #2c3e50; margin-top: 22px; }
  p { margin: 6px 0; }
  ul, ol { margin: 6px 0; padding-left: 22px; }
  li { margin: 4px 0; }
  code { background: #f0f0f0; padding: 1px 4px; border-radius: 3px; font-family: 'Consolas', monospace; font-size: 11px; }
  hr { border: none; border-top: 1px solid #ccc; margin: 18px 0; }
</style></head><body>${body.join('\n')}</body></html>`;
}

function renderPdf(mdFile, browserPath) {
  const markdown = fs.readFileSync(mdFile, 'utf8');
  const titleMatch = markdown.match(/^# (.+)$/m);
  const title = titleMatch ? titleMatch[1] : path.basename(mdFile, '.md');
  const html = mdToHtml(markdown, title);

  const tmpHtml = path.join(os.tmpdir(), `bartlett-sop-${crypto.randomUUID()}.html`);
  fs.writeFileSync(tmpHtml, html, 'utf8');
  const pdfFile = mdFile.replace(/\.md$/, '.pdf');

  try {
    execFileSync(browserPath, [
      '--headless', '--disable-gpu', '--no-pdf-header-footer',
      `--print-to-pdf=${pdfFile}`, tmpHtml,
    ], { stdio: 'ignore', timeout: 30000 });
  } finally {
    fs.rmSync(tmpHtml, { force: true });
  }
  return pdfFile;
}

function findMarkdownFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...findMarkdownFiles(full));
    else if (entry.name.endsWith('.md')) out.push(full);
  }
  return out;
}

export function renderAllSopPdfs() {
  const browserPath = findBrowser();
  const files = findMarkdownFiles(SOPS_DIR);
  files.forEach(file => renderPdf(file, browserPath));
  return { browserPath, count: files.length };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const { browserPath, count } = renderAllSopPdfs();
  console.log(`Rendered ${count} PDF(s) via ${browserPath}`);
}
