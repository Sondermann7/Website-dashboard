import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = path.resolve(__dirname, '..', 'data');

const PHASES = new Set(["DISCOVERY","LOCAL","LINKS","REVIEWS","RESEARCH","CONTENT","GEO","EXTERIORS","ADS","CADENCE"]);
const COLS = new Set(["todo","doing","done"]);
const PRIS = new Set(["HIGH","MED","LOW"]);
const VERIFY_STATUSES = new Set(["unverified","user-stated","observed","source-backed","contradicted","retired"]);
const TOOL_CLASSIFICATIONS = new Set(["installable","reference-only","rejected","already-installed","needs-review","unsafe-for-live"]);
const PENDING_FILES = new Set([
  "measurement-map.json","url-inventory.json","location-page-triage.json",
  "redirect-map.json","ai-visibility-baseline.json"
]);

function isString(v){ return typeof v === 'string'; }

function validateVerifyBlock(v, ctx, errors){
  if (v === undefined) { errors.push(`${ctx}: missing verify block`); return; }
  if (typeof v !== 'object' || v === null) { errors.push(`${ctx}: verify must be an object`); return; }
  if (!VERIFY_STATUSES.has(v.status)) errors.push(`${ctx}: verify.status "${v.status}" not in allowed set`);
}

function validateTasks(tasks, errors){
  if (!Array.isArray(tasks)) { errors.push('tasks.json: must be an array'); return; }
  tasks.forEach((t,i)=>{
    const ctx = `tasks[${i}] (${t && t.t})`;
    if (!t || !isString(t.id)) errors.push(`${ctx}: missing id`);
    if (typeof t.order !== 'number') errors.push(`${ctx}: missing/invalid order`);
    if (!COLS.has(t.col)) errors.push(`${ctx}: col "${t.col}" not in todo|doing|done`);
    if (!PHASES.has(t.ph)) errors.push(`${ctx}: ph "${t.ph}" not a known phase`);
    if (!PRIS.has(t.pri)) errors.push(`${ctx}: pri "${t.pri}" not HIGH|MED|LOW`);
    if (!isString(t.t)) errors.push(`${ctx}: missing title`);
    validateVerifyBlock(t.verify, ctx, errors);
  });
}

function validateCadence(items, errors){
  if (!Array.isArray(items)) { errors.push('cadence.json: must be an array'); return; }
  items.forEach((c,i)=>{
    const ctx = `cadence[${i}] (${c && c.t})`;
    if (!c || !isString(c.id)) errors.push(`${ctx}: missing id`);
    if (c.freq !== 'weekly' && c.freq !== 'monthly') errors.push(`${ctx}: freq "${c.freq}" not weekly|monthly`);
    if (!PHASES.has(c.ph)) errors.push(`${ctx}: ph "${c.ph}" not a known phase`);
    if (!('lastDone' in c)) errors.push(`${ctx}: missing lastDone`);
    validateVerifyBlock(c.verify, ctx, errors);
  });
}

function validateArchive(archive, errors){
  if (!Array.isArray(archive)) errors.push('archive.json: must be an array');
}

function validateSiteFacts(facts, errors){
  if (!Array.isArray(facts)) { errors.push('site-facts.json: must be an array'); return; }
  facts.forEach((f,i)=>{
    const ctx = `site-facts[${i}]`;
    if (!f || !isString(f.id)) errors.push(`${ctx}: missing id`);
    if (!isString(f.fact)) errors.push(`${ctx}: missing fact text`);
    validateVerifyBlock(f.verify, ctx, errors);
  });
}

function validateDecisions(decisions, errors){
  if (!Array.isArray(decisions)) { errors.push('decisions.json: must be an array'); return; }
  decisions.forEach((d,i)=>{
    const ctx = `decisions[${i}]`;
    if (!d || !isString(d.id)) errors.push(`${ctx}: missing id`);
    if (!isString(d.date)) errors.push(`${ctx}: missing date`);
    if (!isString(d.decision)) errors.push(`${ctx}: missing decision text`);
    if (!isString(d.rationale)) errors.push(`${ctx}: missing rationale`);
  });
}

function validateRegistry(items, label, errors){
  if (!Array.isArray(items)) { errors.push(`${label}: must be an array`); return; }
  items.forEach((r,i)=>{
    const ctx = `${label}[${i}]`;
    if (!r || !isString(r.id)) errors.push(`${ctx}: missing id`);
    if (!isString(r.name)) errors.push(`${ctx}: missing name`);
    if (!TOOL_CLASSIFICATIONS.has(r.classification)) errors.push(`${ctx}: classification "${r.classification}" not in allowed set`);
  });
}

function validateVerificationQueue(items, errors){
  if (!Array.isArray(items)) { errors.push('verification-queue.json: must be an array'); return; }
  items.forEach((q,i)=>{
    const ctx = `verification-queue[${i}]`;
    if (!q || !isString(q.id)) errors.push(`${ctx}: missing id`);
    if (!isString(q.claim)) errors.push(`${ctx}: missing claim`);
    if (!isString(q.status)) errors.push(`${ctx}: missing status`);
  });
}

function validateProcedures(items, errors){
  if (!Array.isArray(items)) { errors.push('procedures.json: must be an array'); return; }
  items.forEach((p,i)=>{
    const ctx = `procedures[${i}] (${p && p.title})`;
    if (!p || !isString(p.id)) errors.push(`${ctx}: missing id`);
    if (!isString(p.department)) errors.push(`${ctx}: missing department`);
    if (!isString(p.title)) errors.push(`${ctx}: missing title`);
    if (!isString(p.objective)) errors.push(`${ctx}: missing objective`);
    if (!Array.isArray(p.steps) || !p.steps.length) errors.push(`${ctx}: steps must be a non-empty array`);
  });
}

function validateToolReference(items, errors){
  if (!Array.isArray(items)) { errors.push('tool-reference.json: must be an array'); return; }
  items.forEach((t,i)=>{
    const ctx = `tool-reference[${i}] (${t && t.name})`;
    if (!t || !isString(t.id)) errors.push(`${ctx}: missing id`);
    if (!isString(t.name)) errors.push(`${ctx}: missing name`);
    if (!isString(t.category)) errors.push(`${ctx}: missing category`);
    if (!isString(t.purpose)) errors.push(`${ctx}: missing purpose`);
    if (!Array.isArray(t.howWeUseIt) || !t.howWeUseIt.length) errors.push(`${ctx}: howWeUseIt must be a non-empty array`);
    if (!isString(t.verifiedNotes)) errors.push(`${ctx}: missing verifiedNotes`);
  });
}

function validatePendingScaffold(obj, filename, errors){
  if (!obj || typeof obj !== 'object') { errors.push(`${filename}: must be an object`); return; }
  if (obj.status !== 'pending') errors.push(`${filename}: status must be "pending" until real data lands`);
  if (!isString(obj.note)) errors.push(`${filename}: missing note explaining what unblocks this`);
  if (!Array.isArray(obj.items)) errors.push(`${filename}: items must be an array`);
}

function readJsonIfExists(dataDir, filename){
  const file = path.join(dataDir, filename);
  if (!fs.existsSync(file)) return undefined;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function validateAll(dataDir = DATA_DIR){
  const errors = [];

  const tasks = readJsonIfExists(dataDir, 'tasks.json');
  if (tasks !== undefined) validateTasks(tasks, errors);

  const cadence = readJsonIfExists(dataDir, 'cadence.json');
  if (cadence !== undefined) validateCadence(cadence, errors);

  const archive = readJsonIfExists(dataDir, 'archive.json');
  if (archive !== undefined) validateArchive(archive, errors);

  const siteFacts = readJsonIfExists(dataDir, 'site-facts.json');
  if (siteFacts !== undefined) validateSiteFacts(siteFacts, errors);

  const decisions = readJsonIfExists(dataDir, 'decisions.json');
  if (decisions !== undefined) validateDecisions(decisions, errors);

  const toolRegistry = readJsonIfExists(dataDir, 'tool-registry.json');
  if (toolRegistry !== undefined) validateRegistry(toolRegistry, 'tool-registry.json', errors);

  const sourceRegistry = readJsonIfExists(dataDir, 'source-registry.json');
  if (sourceRegistry !== undefined) validateRegistry(sourceRegistry, 'source-registry.json', errors);

  const verificationQueue = readJsonIfExists(dataDir, 'verification-queue.json');
  if (verificationQueue !== undefined) validateVerificationQueue(verificationQueue, errors);

  const procedures = readJsonIfExists(dataDir, 'procedures.json');
  if (procedures !== undefined) validateProcedures(procedures, errors);

  const toolReference = readJsonIfExists(dataDir, 'tool-reference.json');
  if (toolReference !== undefined) validateToolReference(toolReference, errors);

  for (const filename of PENDING_FILES){
    const scaffold = readJsonIfExists(dataDir, filename);
    if (scaffold !== undefined) validatePendingScaffold(scaffold, filename, errors);
  }

  return { ok: errors.length === 0, errors };
}

// CLI entry point
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const result = validateAll();
  if (result.ok) {
    console.log('validate: OK — all present data files match their schema.');
    process.exit(0);
  } else {
    console.error('validate: FAILED');
    result.errors.forEach(e => console.error(' - ' + e));
    process.exit(1);
  }
}
