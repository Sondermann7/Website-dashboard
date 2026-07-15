import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { runImport } from '../scripts/import.mjs';
import { createServer } from '../server/server.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let dataDir, memoryDir, publicDir, server, baseUrl;

before(async () => {
  dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bob-server-data-'));
  memoryDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bob-server-memory-'));
  publicDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bob-server-public-'));
  fs.writeFileSync(path.join(publicDir, 'index.html'), '<html>ok</html>');
  fs.writeFileSync(path.join(memoryDir, 'log.md'), '# Log\n\n');
  runImport(dataDir);

  server = createServer({ dataDir, memoryDir, publicDir });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

after(async () => {
  await new Promise(resolve => server.close(resolve));
  fs.rmSync(dataDir, { recursive: true, force: true });
  fs.rmSync(memoryDir, { recursive: true, force: true });
  fs.rmSync(publicDir, { recursive: true, force: true });
});

test('GET /api/state returns cycle/cadence/archive', async () => {
  const res = await fetch(`${baseUrl}/api/state`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.cycle.tasks.length, 40);
  assert.equal(body.cadence.length, 14);
  assert.deepEqual(body.archive, []);
});

test('POST /api/tasks persists a valid change to disk', async () => {
  const stateRes = await fetch(`${baseUrl}/api/state`);
  const { cycle } = await stateRes.json();
  const tasks = cycle.tasks;
  tasks[0].col = 'done';

  const res = await fetch(`${baseUrl}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tasks),
  });
  assert.equal(res.status, 200);

  const onDisk = JSON.parse(fs.readFileSync(path.join(dataDir, 'tasks.json'), 'utf8'));
  assert.equal(onDisk[0].col, 'done');
});

test('POST /api/tasks rejects malformed body and leaves file unchanged, with a backup made', async () => {
  const before = fs.readFileSync(path.join(dataDir, 'tasks.json'), 'utf8');
  const malformed = JSON.parse(before);
  delete malformed[0].col;

  const res = await fetch(`${baseUrl}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(malformed),
  });
  assert.equal(res.status, 400);

  const after = fs.readFileSync(path.join(dataDir, 'tasks.json'), 'utf8');
  assert.equal(after, before, 'file must be unchanged after a rejected write');

  const backups = fs.readdirSync(dataDir).filter(f => f.startsWith('tasks') && f.includes('.bak-'));
  assert.ok(backups.length >= 1, 'expected a backup to exist from the earlier successful write');
});

test('POST /api/memory/append writes a dated entry to memory/log.md', async () => {
  const res = await fetch(`${baseUrl}/api/memory/append`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Test finding from server test.' }),
  });
  assert.equal(res.status, 200);
  const log = fs.readFileSync(path.join(memoryDir, 'log.md'), 'utf8');
  assert.ok(log.includes('Test finding from server test.'));
});

test('GET / serves static files from publicDir', async () => {
  const res = await fetch(`${baseUrl}/`);
  assert.equal(res.status, 200);
  const body = await res.text();
  assert.ok(body.includes('<html>ok</html>'));
});

test('GET *.mjs is served with a JavaScript MIME type (required for <script type="module">)', async () => {
  fs.writeFileSync(path.join(publicDir, 'brief.mjs'), 'export const x = 1;');
  const res = await fetch(`${baseUrl}/brief.mjs`);
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /javascript/);
});
