import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { runImport } from '../scripts/import.mjs';
import { createServer, isSameOriginRequest, checkBasicAuth } from '../server/server.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test('isSameOriginRequest: allows no Origin header, allows matching Origin, rejects mismatched Origin', () => {
  assert.equal(isSameOriginRequest({ headers: { host: 'localhost:4178' } }), true);
  assert.equal(isSameOriginRequest({ headers: { host: 'localhost:4178', origin: 'http://localhost:4178' } }), true);
  assert.equal(isSameOriginRequest({ headers: { host: 'localhost:4178', origin: 'http://evil.example' } }), false);
  assert.equal(isSameOriginRequest({ headers: { host: 'localhost:4178', origin: 'not-a-valid-url' } }), false);
});

test('checkBasicAuth: open when unset, requires exact credentials when both DASH_USER/DASH_PASS are set', () => {
  const prevUser = process.env.DASH_USER; const prevPass = process.env.DASH_PASS;
  try {
    delete process.env.DASH_USER; delete process.env.DASH_PASS;
    assert.equal(checkBasicAuth({ headers: {} }), true, 'no creds configured -> open');

    process.env.DASH_USER = 'mikey';
    process.env.DASH_PASS = 'correct-horse-battery-staple';
    const auth = (u, p) => 'Basic ' + Buffer.from(`${u}:${p}`).toString('base64');
    assert.equal(checkBasicAuth({ headers: {} }), false, 'missing header -> rejected');
    assert.equal(checkBasicAuth({ headers: { authorization: auth('mikey', 'wrong') } }), false, 'wrong password -> rejected');
    assert.equal(checkBasicAuth({ headers: { authorization: auth('someone-else', 'correct-horse-battery-staple') } }), false, 'wrong user -> rejected');
    assert.equal(checkBasicAuth({ headers: { authorization: auth('mikey', 'correct-horse-battery-staple') } }), true, 'correct creds -> allowed');
  } finally {
    if (prevUser === undefined) delete process.env.DASH_USER; else process.env.DASH_USER = prevUser;
    if (prevPass === undefined) delete process.env.DASH_PASS; else process.env.DASH_PASS = prevPass;
  }
});

test('POST /api/tasks writes the payload and does not launch anything', async () => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bob-launch-data-'));
  const memoryDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bob-launch-memory-'));
  const publicDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bob-launch-public-'));
  fs.writeFileSync(path.join(publicDir, 'index.html'), '<html>ok</html>');
  runImport(dataDir);

  const server = createServer({ dataDir, memoryDir, publicDir });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    const stateRes = await fetch(`${baseUrl}/api/state`);
    const { cycle } = await stateRes.json();
    const tasks = cycle.tasks;
    tasks[0].col = 'doing';
    tasks[1].col = 'done';

    const res = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tasks),
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.deepEqual(body, { ok: true });

    const written = JSON.parse(fs.readFileSync(path.join(dataDir, 'tasks.json'), 'utf8'));
    assert.equal(written[0].col, 'doing');
    assert.equal(written[1].col, 'done');
  } finally {
    await new Promise(resolve => server.close(resolve));
    fs.rmSync(dataDir, { recursive: true, force: true });
    fs.rmSync(memoryDir, { recursive: true, force: true });
    fs.rmSync(publicDir, { recursive: true, force: true });
  }
});

test('POST /api/tasks from a cross-origin request is rejected before it can write anything', async () => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bob-launch-data-'));
  const memoryDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bob-launch-memory-'));
  const publicDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bob-launch-public-'));
  fs.writeFileSync(path.join(publicDir, 'index.html'), '<html>ok</html>');
  runImport(dataDir);

  const server = createServer({ dataDir, memoryDir, publicDir });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    const before = fs.readFileSync(path.join(dataDir, 'tasks.json'), 'utf8');
    const tasks = JSON.parse(before);
    tasks[0].col = 'doing';

    const res = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Origin': 'http://evil.example' },
      body: JSON.stringify(tasks),
    });
    assert.equal(res.status, 403);

    const after = fs.readFileSync(path.join(dataDir, 'tasks.json'), 'utf8');
    assert.equal(after, before, 'cross-origin write must not touch the file');
  } finally {
    await new Promise(resolve => server.close(resolve));
    fs.rmSync(dataDir, { recursive: true, force: true });
    fs.rmSync(memoryDir, { recursive: true, force: true });
    fs.rmSync(publicDir, { recursive: true, force: true });
  }
});
