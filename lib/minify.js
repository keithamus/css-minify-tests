/**
 * @file Generic minifier function for any registered minifiers.
 */

import { registry } from './loaders/loadAllMinifiers.js';

/**
 * Runs the minification function of the given named minifier with the given
 * CSS source string. Ensures all outputs are trimmed for accurate comparisons.
 *
 * @param  {string} name    Name of the minifier (csso, sass, etc)
 * @param  {string} source  Any string of CSS to be minified
 * @return {string}         The minified output
 */
export async function minify (name, source) {
  const fn = registry.get(name);
  if (!fn) {
    throw new Error('Unknown minifier: ' + name);
  }
  const output = await fn(source);
  return output.trim();
}
