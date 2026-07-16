/**
 * @file Generic minifier function for any registered minifiers.
 */

import { registry } from './loaders/loadAllMinifiers.js';

/**
 * Runs the minification function of the given named minifier with the given
 * CSS source string. Ensures all outputs are trimmed for accurate comparisons.
 *
 * @param  {string} minifierName  Name of the minifier (csso, sass, etc)
 * @param  {string} source        Any string of CSS to be minified
 * @return {string}               The minified output
 */
export async function minify (minifierName, source) {
  const fn = registry[minifierName].minify;
  if (!fn) {
    throw new Error('Unknown minifier: ' + minifierName);
  }
  const output = await fn(source);
  return output.trim();
}
