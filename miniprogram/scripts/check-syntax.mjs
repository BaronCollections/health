import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const appConfig = JSON.parse(fs.readFileSync(path.join(rootDir, 'app.json'), 'utf8'));

const files = [
  path.join(rootDir, 'app.js'),
  path.join(rootDir, 'custom-tab-bar', 'index.js'),
];

for (const pagePath of appConfig.pages || []) {
  files.push(path.join(rootDir, `${pagePath}.js`));
}

function collectModuleFiles(dirPath, collected = []) {
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      collectModuleFiles(entryPath, collected);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.js')) {
      collected.push(entryPath);
    }
  }

  return collected;
}

files.push(...collectModuleFiles(path.join(rootDir, 'config')));
files.push(...collectModuleFiles(path.join(rootDir, 'services')));
files.push(...collectModuleFiles(path.join(rootDir, 'store')));

const uniqueFiles = [...new Set(files)].filter((filePath) => fs.existsSync(filePath));

execFileSync(process.execPath, ['--check', ...uniqueFiles], {
  cwd: rootDir,
  stdio: 'inherit',
});

console.log(`syntax ok (${uniqueFiles.length} files)`);
