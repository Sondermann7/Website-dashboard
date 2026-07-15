import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { runImport } from '../scripts/import.mjs';
import { createServer, detectNewlyMovedToDoing, launchCowork } from '../server/server.js';

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

test('launchCowork spawns cmd.exe start with the task brief, does not block on a real process', () => {
  const calls = [];
  const fakeChild = { unref: () => { calls.push('unrefed'); } };
  const spawnFn = (cmd, args, opts) => { calls.push({ cmd, args, opts }); return fakeChild; };

  const task = { id: 't1', t: 'Confirm a working backup exists before any change', ph: 'DISCOVERY', pri: 'HIGH', w: 'W1', where: 'Hosting panel', exec: ['Step 1'] };
  launchCowork(task, { spawnFn });

  const spawnCall = calls.find(c => c && c.cmd);
  assert.equal(spawnCall.cmd, 'cmd.exe');
  assert.equal(spawnCall.args[0], '/c');
  assert.equal(spawnCall.args[1], 'start');
  assert.ok(spawnCall.args.includes('claude'));
  const briefArg = spawnCall.args[spawnCall.args.length - 1];
  assert.ok(briefArg.includes('Confirm a working backup exists before any change'));
  assert.ok(briefArg.includes('Cowork operator brief'));
  assert.ok(calls.includes('unrefed'), 'expected the spawned child to be unref()ed so it does not keep the server process alive');
});

test('launchCowork collapses newlines out of the brief — cmd.exe start silently drops multi-line args', () => {
  // Confirmed empirically: `cmd /c start title claude "<single line>"` launches claude;
  // the identical call with embedded \n in the argument launches nothing, no error surfaced.
  const calls = [];
  const spawnFn = (cmd, args) => { calls.push(args); return { unref(){} }; };
  const task = { id: 't1', t: 'Multi\nline\n\ntest', ph: 'DISCOVERY', pri: 'HIGH', w: 'W1', exec: ['Step 1', 'Step 2'] };
  launchCowork(task, { spawnFn });
  const briefArg = calls[0][calls[0].length - 1];
  assert.ok(!briefArg.includes('\n'), 'brief argument must not contain a raw newline');
  assert.ok(briefArg.includes('MISSION'));
  assert.ok(briefArg.includes('SAFETY RULES'));
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
