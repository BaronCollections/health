import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const includeDirs = ['config', 'pages'];
const rootJsonFiles = ['app.json', 'project.config.json', 'project.private.config.json', 'sitemap.json'];

function walkJsonFiles(dirPath, collected = []) {
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    if (entry.name === 'miniprogram_npm' || entry.name === 'node_modules') {
      continue;
    }

    const entryPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      walkJsonFiles(entryPath, collected);
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.json')) {
      collected.push(entryPath);
    }
  }

  return collected;
}

const files = [
  ...rootJsonFiles.map((file) => path.join(rootDir, file)),
  ...includeDirs.flatMap((dir) => walkJsonFiles(path.join(rootDir, dir))),
];

for (const filePath of files) {
  JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

console.log(`json ok (${files.length} files)`);
