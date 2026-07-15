import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { seedCycle1, seedCadence } from './seeds.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DATA_DIR = path.resolve(__dirname, '..', 'data');

function freshVerify(){
  return { status: 'unverified', confidence: 'low', source: null, checkedAt: null, note: '' };
}

function backupIfExists(file){
  if (!fs.existsSync(file)) return;
  const stamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
  const backup = file.replace(/\.json$/i, `.bak-${stamp}.json`);
  fs.copyFileSync(file, backup);
}

function writeJson(dataDir, filename, value){
  const file = path.join(dataDir, filename);
  backupIfExists(file);
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
  return file;
}

export function runImport(dataDir = DEFAULT_DATA_DIR){
  const tasks = seedCycle1().map(t => ({ ...t, verify: freshVerify() }));
  const cadence = seedCadence().map(c => ({ ...c, verify: freshVerify() }));
  const archive = [];

  writeJson(dataDir, 'tasks.json', tasks);
  writeJson(dataDir, 'cadence.json', cadence);
  writeJson(dataDir, 'archive.json', archive);

  return { tasks, cadence, archive };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const dataDir = process.env.BARTLETT_DATA_DIR
    ? path.resolve(process.env.BARTLETT_DATA_DIR)
    : DEFAULT_DATA_DIR;
  const { tasks, cadence } = runImport(dataDir);
  console.log(`import: wrote ${tasks.length} tasks, ${cadence.length} cadence items, 0 archived cycles → ${dataDir}`);
}
