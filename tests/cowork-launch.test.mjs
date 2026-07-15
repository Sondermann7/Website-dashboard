import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { runImport } from '../scripts/import.mjs';
import { createServer, detectNewlyMovedToDoing, launchCowork, isSameOriginRequest } from '../server/server.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test('detectNewlyMovedToDoing: only tasks that just transitioned into doing', () => {
  const prev = [
    { id: 'a', col: 'todo' },
    { id: 'b', col: 'doing' },
    { id: 'c', col: 'done' },
  ];
  const next = [
    { id: 'a', col: 'doing' }, // todo -> doing: should fire
    { id: 'b', col: 'doing' }, // already doing: should NOT fire again
    { id: 'c', col: 'todo' },  // done -> todo: should NOT fire
    { id: 'd', col: 'doing' }, // brand new task straight into doing: should fire
  ];
  const result = detectNewlyMovedToDoing(prev, next);
  assert.deepEqual(result.map(t => t.id).sort(), ['a', 'd']);
});

test('detectNewlyMovedToDoing: empty prev/next arrays produce no false positives', () => {
  assert.deepEqual(detectNewlyMovedToDoing([], []), []);
  assert.deepEqual(detectNewlyMovedToDoing([], [{ id: 'x', col: 'todo' }]), []);
});

test('isSameOriginRequest: allows no Origin header, allows matching Origin, rejects mismatched Origin', () => {
  assert.equal(isSameOriginRequest({ headers: { host: 'localhost:4178' } }), true);
  assert.equal(isSameOriginRequest({ headers: { host: 'localhost:4178', origin: 'http://localhost:4178' } }), true);
  assert.equal(isSameOriginRequest({ headers: { host: 'localhost:4178', origin: 'http://evil.example' } }), false);
  assert.equal(isSameOriginRequest({ headers: { host: 'localhost:4178', origin: 'not-a-valid-url' } }), false);
});

test('launchCowork never places task-controlled content on the cmd.exe command line — it goes through a temp file instead', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bob-launch-tmp-'));
  const calls = [];
  const fakeChild = { unref: () => { calls.push('unrefed'); } };
  const spawnFn = (cmd, args, opts) => { calls.push({ cmd, args, opts }); return fakeChild; };

  // Task fields are attacker/API-writable — include shell metacharacters and newlines
  // to prove none of it ever reaches the parsed command line.
  const task = {
    id: 't1',
    t: 'Injection test " & calc.exe & "\nmulti\nline\ntitle',
    note: 'note with `backticks` and $(command) and | pipes',
    ph: 'DISCOVERY', pri: 'HIGH', w: 'W1', where: 'Hosting panel',
    exec: ['Step with "quotes" & ampersands'],
  };
  launchCowork(task, { spawnFn, tmpDir });

  const spawnCall = calls.find(c => c && c.cmd);
  assert.equal(spawnCall.cmd, 'cmd.exe');
  assert.deepEqual(spawnCall.args.slice(0, 3), ['/c', 'start', 'Cowork Task'], 'title must be the fixed constant, never task.t');
  assert.equal(spawnCall.args[3], 'powershell.exe');
  assert.ok(spawnCall.args.includes('-File'));
  assert.ok(spawnCall.args.some(a => a.endsWith('cowork-launch.ps1')));
  assert.ok(spawnCall.args.includes('-BriefFile'));

  const briefFileArg = spawnCall.args[spawnCall.args.length - 1];
  assert.ok(briefFileArg.startsWith(tmpDir), 'brief file must live in the provided temp dir');
  assert.match(path.basename(briefFileArg), /^bartlett-cowork-[0-9a-f-]+\.txt$/, 'filename must be a generated UUID, never derived from task data');

  // None of the untrusted task content appears anywhere in the actual argv passed to spawn.
  const fullCommandLine = spawnCall.args.join(' ');
  assert.ok(!fullCommandLine.includes('calc.exe'));
  assert.ok(!fullCommandLine.includes('backticks'));
  assert.ok(!fullCommandLine.includes(task.t));

  // The untrusted content instead lives in the file, which the trusted wrapper script reads.
  const fileContent = fs.readFileSync(briefFileArg, 'utf8');
  assert.ok(fileContent.includes('calc.exe'));
  assert.ok(fileContent.includes('MISSION'));
  assert.ok(calls.includes('unrefed'), 'expected the spawned child to be unref()ed so it does not keep the server process alive');

  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('POST /api/tasks triggers launchCoworkFn exactly for tasks newly moved to doing', async () => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bob-launch-data-'));
  const memoryDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bob-launch-memory-'));
  const publicDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bob-launch-public-'));
  fs.writeFileSync(path.join(publicDir, 'index.html'), '<html>ok</html>');
  runImport(dataDir);

  const launched = [];
  const server = createServer({ dataDir, memoryDir, publicDir, launchCoworkFn: (task) => launched.push(task.id) });
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
    assert.deepEqual(body.launchedCowork, [tasks[0].id]);
    assert.deepEqual(launched, [tasks[0].id]);

    // Moving the same task again while it's still "doing" must not re-launch.
    const res2 = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tasks),
    });
    assert.equal(res2.status, 200);
    const body2 = await res2.json();
    assert.deepEqual(body2.launchedCowork, []);
    assert.deepEqual(launched, [tasks[0].id], 'should not launch a second time for a task already in doing');
  } finally {
    await new Promise(resolve => server.close(resolve));
    fs.rmSync(dataDir, { recursive: true, force: true });
    fs.rmSync(memoryDir, { recursive: true, force: true });
    fs.rmSync(publicDir, { recursive: true, force: true });
  }
});

test('POST /api/tasks from a cross-origin request is rejected before it can write or launch anything', async () => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bob-launch-data-'));
  const memoryDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bob-launch-memory-'));
  const publicDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bob-launch-public-'));
  fs.writeFileSync(path.join(publicDir, 'index.html'), '<html>ok</html>');
  runImport(dataDir);

  const launched = [];
  const server = createServer({ dataDir, memoryDir, publicDir, launchCoworkFn: (task) => launched.push(task.id) });
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
    assert.deepEqual(launched, [], 'cross-origin request must never trigger a Cowork launch');
  } finally {
    await new Promise(resolve => server.close(resolve));
    fs.rmSync(dataDir, { recursive: true, force: true });
    fs.rmSync(memoryDir, { recursive: true, force: true });
    fs.rmSync(publicDir, { recursive: true, force: true });
  }
});
