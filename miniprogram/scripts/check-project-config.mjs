import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const projectConfigPath = path.join(rootDir, 'project.config.json');
const appConfigPath = path.join(rootDir, 'app.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const projectConfig = readJson(projectConfigPath);
const appConfig = readJson(appConfigPath);
const pageSet = new Set(appConfig.pages || []);
const compileEntries = projectConfig?.condition?.miniprogram?.list || [];

if (projectConfig.projectname !== 'MintBit') {
  throw new Error(`Expected projectname to be MintBit, received ${projectConfig.projectname || '<empty>'}`);
}

if (!Array.isArray(compileEntries) || compileEntries.length === 0) {
  throw new Error('No mini program compile entries configured.');
}

for (const entry of compileEntries) {
  if (!entry.pathName || !pageSet.has(entry.pathName)) {
    throw new Error(`Compile entry is not registered in app.json: ${entry.pathName || '<empty>'}`);
  }

  const jsPath = path.join(rootDir, `${entry.pathName}.js`);
  if (!fs.existsSync(jsPath)) {
    throw new Error(`Compile entry target is missing: ${entry.pathName}`);
  }
}

console.log(`project config ok (${compileEntries.length} compile entries)`);
