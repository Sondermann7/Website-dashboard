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

test('validateAll accepts the real committed site-facts.json and decisions.json', () => {
  const dataDir = path.resolve(ROOT, 'data');
  const facts = JSON.parse(fs.readFileSync(path.join(dataDir, 'site-facts.json'), 'utf8'));
  const decisions = JSON.parse(fs.readFileSync(path.join(dataDir, 'decisions.json'), 'utf8'));
  assert.ok(facts.length >= 10, 'expected the seeded Bartlett context facts');
  assert.ok(facts.every(f => f.verify && typeof f.verify.status === 'string'));
  assert.ok(decisions.length >= 4, 'expected the four confirmed build decisions');
  const result = validateAll(dataDir);
  assert.deepEqual(result.errors, []);
  assert.equal(result.ok, true);
});

test('tool-registry and source-registry are seeded and valid, with no overlap in division of labor', () => {
  const dataDir = path.resolve(ROOT, 'data');
  const tools = JSON.parse(fs.readFileSync(path.join(dataDir, 'tool-registry.json'), 'utf8'));
  const sources = JSON.parse(fs.readFileSync(path.join(dataDir, 'source-registry.json'), 'utf8'));
  assert.ok(tools.length >= 4);
  assert.ok(sources.length >= 2);
  // tool-registry = installable capabilities; source-registry = reference-only material.
  assert.ok(tools.every(t => t.classification !== 'reference-only'), 'installable tools should not be classified reference-only');
  assert.ok(sources.every(s => s.classification === 'reference-only'), 'source-registry should only ever hold reference-only entries');
  const result = validateAll(dataDir);
  assert.equal(result.ok, true);
});

test('verification-queue is seeded with the highest-value unverified claims', () => {
  const dataDir = path.resolve(ROOT, 'data');
  const queue = JSON.parse(fs.readFileSync(path.join(dataDir, 'verification-queue.json'), 'utf8'));
  assert.ok(queue.length >= 5);
  assert.ok(queue.some(q => q.claim.includes('top 50')));
  const result = validateAll(dataDir);
  assert.equal(result.ok, true);
});

test('the five pending scaffolds are empty and clearly labeled, not populated with invented data', () => {
  const dataDir = path.resolve(ROOT, 'data');
  const PENDING = ['measurement-map.json','url-inventory.json','location-page-triage.json','redirect-map.json','ai-visibility-baseline.json'];
  for (const filename of PENDING) {
    const scaffold = JSON.parse(fs.readFileSync(path.join(dataDir, filename), 'utf8'));
    assert.equal(scaffold.status, 'pending', `${filename} should be status:pending`);
    assert.deepEqual(scaffold.items, [], `${filename} should have no invented items yet`);
    assert.ok(scaffold.note && scaffold.note.length > 10, `${filename} should explain what unblocks it`);
  }
  const result = validateAll(dataDir);
  assert.equal(result.ok, true);
});
