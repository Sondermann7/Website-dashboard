import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { validateAll } from '../scripts/validate.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// SEED_* is what ships in the image/repo (git-tracked, read-only in spirit).
// ACTIVE_* is where the server actually reads/writes — normally the same as
// SEED_*, but on Railway these point at a mounted volume instead, since a
// container's own filesystem is rebuilt from the image on every deploy and
// restart. See seedActiveDirsIfEmpty() below for the one-time copy that
// bridges the two on a volume's first boot.
const SEED_DATA_DIR = path.resolve(__dirname, '..', 'data');
const SEED_MEMORY_DIR = path.resolve(__dirname, '..', 'memory');
const DEFAULT_DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : SEED_DATA_DIR;
const DEFAULT_MEMORY_DIR = process.env.MEMORY_DIR ? path.resolve(process.env.MEMORY_DIR) : SEED_MEMORY_DIR;
const DEFAULT_PUBLIC_DIR = path.resolve(__dirname, '..', 'public');

/**
 * On first boot against a fresh (empty) mounted volume, seed it from the
 * data/memory shipped in the image so the dashboard isn't blank. Never
 * overwrites an already-seeded volume — this only fires once, the moment
 * ACTIVE_DIR has no tasks.json/log.md of its own yet.
 */
export function seedActiveDirsIfEmpty(){
  if (DEFAULT_DATA_DIR !== SEED_DATA_DIR && !fs.existsSync(path.join(DEFAULT_DATA_DIR, 'tasks.json'))) {
    fs.mkdirSync(DEFAULT_DATA_DIR, { recursive: true });
    fs.cpSync(SEED_DATA_DIR, DEFAULT_DATA_DIR, { recursive: true });
  }
  if (DEFAULT_MEMORY_DIR !== SEED_MEMORY_DIR && !fs.existsSync(path.join(DEFAULT_MEMORY_DIR, 'log.md'))) {
    fs.mkdirSync(DEFAULT_MEMORY_DIR, { recursive: true });
    fs.cpSync(SEED_MEMORY_DIR, DEFAULT_MEMORY_DIR, { recursive: true });
  }
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

function send(res, status, body, type = 'application/json; charset=utf-8'){
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(body);
}

function json(res, status, payload){
  send(res, status, JSON.stringify(payload, null, 2));
}

function readBody(req){
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 5_000_000) {
        reject(new Error('Request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

function safeStaticPath(root, urlPath){
  const file = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
  const resolved = path.resolve(root, file);
  if (!resolved.startsWith(root)) return null;
  return resolved;
}

function backupThenWrite(file, contents){
  if (fs.existsSync(file)) {
    const stamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
    const backup = file.replace(/\.json$/i, `.bak-${stamp}.json`);
    fs.copyFileSync(file, backup);
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents, 'utf8');
}

function readJson(dataDir, filename, fallback){
  const file = path.join(dataDir, filename);
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/**
 * Write a candidate value for `filename`, but only after confirming the
 * resulting data directory still passes validateAll(). This is the
 * integrity guarantee: a bad UI state or a bad Cowork paste can 400
 * instead of corrupting the file-backed brain.
 */
function writeValidated(dataDir, filename, candidateValue){
  const file = path.join(dataDir, filename);
  const previous = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : undefined;
  const candidateJson = JSON.stringify(candidateValue, null, 2) + '\n';

  fs.writeFileSync(file, candidateJson, 'utf8');
  const result = validateAll(dataDir);
  if (!result.ok) {
    if (previous !== undefined) fs.writeFileSync(file, previous, 'utf8');
    else fs.rmSync(file, { force: true });
    return { ok: false, errors: result.errors };
  }

  if (previous !== undefined) backupThenWrite(file, previous);
  fs.writeFileSync(file, candidateJson, 'utf8');
  return { ok: true };
}

function appendMemoryLog(memoryDir, text){
  const file = path.join(memoryDir, 'log.md');
  fs.mkdirSync(memoryDir, { recursive: true });
  if (!fs.existsSync(file)) fs.writeFileSync(file, '# Memory Log\n\n', 'utf8');
  const stamp = new Date().toISOString();
  fs.appendFileSync(file, `\n### ${stamp}\n${text}\n`, 'utf8');
}

/**
 * Split memory/log.md into individual dated entries for display. Each entry
 * starts with a "### <heading>" line (either a raw ISO timestamp from the
 * Memory tab, or a "YYYY-MM-DD — title" heading from a hand-written/direct
 * entry) followed by its body text. Returned newest-first so the dashboard
 * doesn't bury today's entry at the bottom of a long-running file.
 */
function readMemoryEntries(memoryDir){
  const file = path.join(memoryDir, 'log.md');
  if (!fs.existsSync(file)) return [];
  const text = fs.readFileSync(file, 'utf8');
  const parts = text.split(/^### /m).slice(1);
  const entries = parts.map(part => {
    const newline = part.indexOf('\n');
    const heading = (newline === -1 ? part : part.slice(0, newline)).trim();
    const body = (newline === -1 ? '' : part.slice(newline + 1)).trim();
    return { heading, body };
  });
  return entries.reverse();
}

/**
 * Origin-based CSRF guard for mutating routes. Browsers always attach an
 * Origin header on cross-origin requests — including "simple" form POSTs
 * (e.g. a malicious page posting text/plain JSON to this local port), which
 * would otherwise reach /api/tasks (or /api/cadence, /api/archive,
 * /api/memory/append) with attacker-chosen content and silently rewrite the
 * file-backed brain. No Origin header at all (curl, same-page requests in
 * some older engines) is allowed through; a *present* Origin that doesn't
 * match this server's own host is rejected.
 */
function timingSafeEqualStr(a, b){
  const bufA = Buffer.from(a); const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Gate the whole dashboard behind HTTP Basic Auth whenever DASH_USER/DASH_PASS
 * are both set (the deployed/live case) — with no dashboard-level accounts or
 * sessions to build, this is the smallest addition that stops an unauthenticated
 * visitor from reading or editing the file-backed brain. Unset (the local-dev
 * default) leaves the server open, matching its previous behavior.
 */
export function checkBasicAuth(req){
  const user = process.env.DASH_USER;
  const pass = process.env.DASH_PASS;
  if (!user || !pass) return true;
  const header = req.headers.authorization || '';
  const match = /^Basic (.+)$/.exec(header);
  if (!match) return false;
  let decoded;
  try { decoded = Buffer.from(match[1], 'base64').toString('utf8'); } catch { return false; }
  const sep = decoded.indexOf(':');
  if (sep === -1) return false;
  return timingSafeEqualStr(decoded.slice(0, sep), user) && timingSafeEqualStr(decoded.slice(sep + 1), pass);
}

export function isSameOriginRequest(req){
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

export function createServer({
  dataDir = DEFAULT_DATA_DIR,
  memoryDir = DEFAULT_MEMORY_DIR,
  publicDir = DEFAULT_PUBLIC_DIR,
} = {}){
  async function routeApi(req, res, parsed){
    try {
      if (req.method === 'POST' && !isSameOriginRequest(req)) {
        return json(res, 403, { error: 'Cross-origin request rejected' });
      }

      if (parsed.pathname === '/api/state') {
        const tasks = readJson(dataDir, 'tasks.json', []);
        const cadence = readJson(dataDir, 'cadence.json', []);
        const archive = readJson(dataDir, 'archive.json', []);
        return json(res, 200, {
          cycle: { number: 1, name: 'Foundation', tasks },
          cadence,
          archive,
        });
      }

      if (parsed.pathname === '/api/tasks' && req.method === 'POST') {
        const body = JSON.parse((await readBody(req)) || '[]');
        const result = writeValidated(dataDir, 'tasks.json', body);
        if (!result.ok) return json(res, 400, { error: 'Invalid tasks payload', details: result.errors });
        return json(res, 200, { ok: true });
      }

      if (parsed.pathname === '/api/cadence' && req.method === 'POST') {
        const body = JSON.parse((await readBody(req)) || '[]');
        const result = writeValidated(dataDir, 'cadence.json', body);
        if (!result.ok) return json(res, 400, { error: 'Invalid cadence payload', details: result.errors });
        return json(res, 200, { ok: true });
      }

      if (parsed.pathname === '/api/archive' && req.method === 'POST') {
        const body = JSON.parse((await readBody(req)) || '[]');
        const result = writeValidated(dataDir, 'archive.json', body);
        if (!result.ok) return json(res, 400, { error: 'Invalid archive payload', details: result.errors });
        return json(res, 200, { ok: true });
      }

      if (parsed.pathname === '/api/memory' && req.method === 'GET') {
        return json(res, 200, { entries: readMemoryEntries(memoryDir) });
      }

      if (parsed.pathname === '/api/memory/append' && req.method === 'POST') {
        const body = JSON.parse((await readBody(req)) || '{}');
        if (typeof body.text !== 'string' || !body.text.trim()) {
          return json(res, 400, { error: 'text is required' });
        }
        appendMemoryLog(memoryDir, body.text.trim());
        return json(res, 200, { ok: true });
      }

      return json(res, 404, { error: 'Unknown API route' });
    } catch (error) {
      return json(res, 500, { error: error.message });
    }
  }

  function routeStatic(res, pathname){
    const file = safeStaticPath(publicDir, pathname);
    if (!file || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      return send(res, 404, 'Not found', 'text/plain; charset=utf-8');
    }
    send(res, 200, fs.readFileSync(file), MIME[path.extname(file)] || 'application/octet-stream');
  }

  return http.createServer((req, res) => {
    if (!checkBasicAuth(req)) {
      res.writeHead(401, {
        'WWW-Authenticate': 'Basic realm="Bartlett Ops Brain"',
        'Content-Type': 'text/plain; charset=utf-8',
      });
      return res.end('Authentication required');
    }
    const parsed = new URL(req.url, 'http://localhost');
    if (parsed.pathname.startsWith('/api/')) return routeApi(req, res, parsed);
    return routeStatic(res, parsed.pathname);
  });
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  seedActiveDirsIfEmpty();
  const PORT = Number(process.env.PORT || 4178);
  const server = createServer({});
  server.listen(PORT, () => {
    console.log(`Bartlett Ops Brain running at http://localhost:${PORT}`);
  });
}
