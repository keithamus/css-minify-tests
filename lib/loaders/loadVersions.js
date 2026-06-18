/**
 * @file Loads in the minifier version numbers from node_modules.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { minifiers } from './loadAllMinifiers.js';

/**
 * Gets the version numbers for all minifiers by
 * looking in the node_modules folder.
 *
 * @param  {string[]} names  Names of all minifiers to check
 * @return {object}          Keys are minifier names, values are version strings
 */
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
      const manifestPath = resolve(...pathParts);
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
      versions[name] = manifest.version;
    } catch {
      versions[name] = null;
    }
  }
  return versions;
}
