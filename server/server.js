import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { validateAll } from '../scripts/validate.mjs';
import { buildPrompt } from '../public/brief.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DATA_DIR = path.resolve(__dirname, '..', 'data');
const DEFAULT_MEMORY_DIR = path.resolve(__dirname, '..', 'memory');
const DEFAULT_PUBLIC_DIR = path.resolve(__dirname, '..', 'public');

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
 * Tasks whose col just became "doing" in `nextTasks` but weren't "doing"
 * in `prevTasks` (or are brand new). Pure/diff-only so it's cheaply testable
 * without touching the filesystem or spawning anything.
 */
export function detectNewlyMovedToDoing(prevTasks, nextTasks){
  const prevById = new Map(prevTasks.map(t => [t.id, t]));
  return nextTasks.filter(t => t.col === 'doing' && prevById.get(t.id)?.col !== 'doing');
}

/**
 * cmd.exe's `start` parses its arguments as a single command line — embedded
 * newlines silently truncate/break the launch (confirmed empirically: a
 * one-line argument with quotes/colons/dashes launches fine, the same text
 * with newlines does not launch anything, with no error surfaced). Collapse
 * paragraph breaks and line breaks to spaced separators so the brief still
 * reads as structured text without carrying a real newline byte.
 */
function toSingleLine(text){
  return text.replace(/\n\n+/g, '   //   ').replace(/\n/g, '  ');
}

/**
 * Fully automatic, no-confirmation launch: spawns a new terminal window
 * running the Claude Code CLI with the task's full Cowork brief as the
 * initial prompt. Windows-only (uses cmd.exe's `start`). Fire-and-forget —
 * callers don't await completion of the spawned session.
 */
export function launchCowork(task, { spawnFn = spawn } = {}){
  const brief = toSingleLine(buildPrompt(task));
  const title = `Cowork: ${task.t}`.slice(0, 200);
  const child = spawnFn('cmd.exe', ['/c', 'start', title, 'claude', brief], {
    detached: true,
    stdio: 'ignore',
    windowsHide: false,
  });
  if (child && typeof child.unref === 'function') child.unref();
  return child;
}

export function createServer({
  dataDir = DEFAULT_DATA_DIR,
  memoryDir = DEFAULT_MEMORY_DIR,
  publicDir = DEFAULT_PUBLIC_DIR,
  launchCoworkFn = launchCowork,
} = {}){
  async function routeApi(req, res, parsed){
    try {
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
        const prevTasks = readJson(dataDir, 'tasks.json', []);
        const result = writeValidated(dataDir, 'tasks.json', body);
        if (!result.ok) return json(res, 400, { error: 'Invalid tasks payload', details: result.errors });
        const launched = detectNewlyMovedToDoing(prevTasks, body);
        launched.forEach(task => launchCoworkFn(task));
        return json(res, 200, { ok: true, launchedCowork: launched.map(t => t.id) });
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
    const parsed = new URL(req.url, 'http://localhost');
    if (parsed.pathname.startsWith('/api/')) return routeApi(req, res, parsed);
    return routeStatic(res, parsed.pathname);
  });
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const PORT = Number(process.env.PORT || 4178);
  const server = createServer({});
  server.listen(PORT, () => {
    console.log(`Bartlett Ops Brain running at http://localhost:${PORT}`);
  });
}
