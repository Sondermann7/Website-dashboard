import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { validateAll } from '../scripts/validate.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function runImport(dataDir){
  execFileSync(process.execPath, [path.join(ROOT, 'scripts', 'import.mjs')], {
    env: { ...process.env, BARTLETT_DATA_DIR: dataDir },
  });
}

test('import writes tasks/cadence/archive with verify blocks', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'bob-import-'));
  runImport(tmp);

  const tasks = JSON.parse(fs.readFileSync(path.join(tmp, 'tasks.json'), 'utf8'));
  assert.equal(Array.isArray(tasks), true);
  assert.equal(tasks.length, 40);
  for (const t of tasks) {
    assert.equal(typeof t.w, 'string');
    assert.equal(typeof t.ph, 'string');
    assert.equal(typeof t.pri, 'string');
    assert.equal(typeof t.t, 'string');
    assert.ok(['todo','doing','done'].includes(t.col));
    assert.equal(typeof t.id, 'string');
    assert.equal(typeof t.order, 'number');
    assert.equal(t.verify.status, 'unverified');
  }

  const cadence = JSON.parse(fs.readFileSync(path.join(tmp, 'cadence.json'), 'utf8'));
  assert.equal(cadence.length, 14);
  for (const c of cadence) {
    assert.ok(['weekly','monthly'].includes(c.freq));
    assert.equal(c.lastDone, null);
    assert.equal(c.verify.status, 'unverified');
  }

  const archive = JSON.parse(fs.readFileSync(path.join(tmp, 'archive.json'), 'utf8'));
  assert.deepEqual(archive, []);

  fs.rmSync(tmp, { recursive: true, force: true });
});

test('import backs up existing files before overwriting', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'bob-import-'));
  fs.writeFileSync(path.join(tmp, 'tasks.json'), '[]');
  runImport(tmp);
  const backups = fs.readdirSync(tmp).filter(f => f.includes('.bak-'));
  assert.ok(backups.length >= 1, 'expected at least one backup file');
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('validateAll passes on freshly imported data', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'bob-validate-'));
  runImport(tmp);
  const result = validateAll(tmp);
  assert.deepEqual(result.errors, []);
  assert.equal(result.ok, true);
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('validateAll fails when a task is missing col', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'bob-validate-'));
  runImport(tmp);
  const tasksFile = path.join(tmp, 'tasks.json');
  const tasks = JSON.parse(fs.readFileSync(tasksFile, 'utf8'));
  delete tasks[0].col;
  fs.writeFileSync(tasksFile, JSON.stringify(tasks));
  const result = validateAll(tmp);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(e => e.includes('col')));
  fs.rmSync(tmp, { recursive: true, force: true });
});
