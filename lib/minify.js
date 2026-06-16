import fs from 'node:fs';
import path from 'node:path';

import { minifiers, registry } from './loaders/loadAllMinifiers.js';

export async function minify (name, source) {
  const fn = registry.get(name);
  if (!fn) throw new Error(`Unknown minifier: ${name}`);
  const output = await fn(source);
  return output.trim();
}

export function getVersions (names = minifiers) {
  const versions = {};
  const scopedPackages = {
    csslop: '@thejaredwilcurt'
  };
  for (let name of names) {
    const pathParts = [
      import.meta.dirname,
      '..',
      'node_modules'
    ];
    if (scopedPackages[name]) {
      pathParts.push(scopedPackages[name]);
    }
    pathParts.push(name);
    pathParts.push('package.json');
    try {
      const pkgPath = path.resolve(...pathParts);
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      versions[name] = pkg.version;
    } catch {
      versions[name] = null;
    }
  }
  return versions;
}
