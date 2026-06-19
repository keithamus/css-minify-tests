/**
 * @file Loads in the minifier version numbers from node_modules.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { minifiers } from './loadAllMinifiers.js';

const __dirname = import.meta.dirname;

/**
 * Gets the version numbers for all minifiers by
 * looking in the node_modules folder.
 *
 * @param  {string[]} names  Names of all minifiers to check
 * @return {object}          Keys are minifier names, values are version strings
 */
export function getVersions () {
  const versions = {};
  const scopedPackages = {
    csslop: '@thejaredwilcurt'
  };
  for (let minifierName of minifiers) {
    const pathParts = [
      __dirname,
      '..',
      '..',
      'node_modules'
    ];
    if (scopedPackages[minifierName]) {
      pathParts.push(scopedPackages[minifierName]);
    }
    pathParts.push(minifierName);
    pathParts.push('package.json');
    try {
      const manifestPath = resolve(...pathParts);
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
      versions[minifierName] = manifest.version;
    } catch {
      versions[minifierName] = null;
    }
  }
  return versions;
}
