/**
 * @file Logic related to reporting or storing the results of real-world test runs.
 */

import {
  mkdirSync,
  writeFileSync
} from 'node:fs';
import { join } from 'node:path';

import {
  durationNsToMs,
  formatMs
} from '../helpers.js';

const __dirname = import.meta.dirname;

/**
 * Saves the output of each minifed real world file into
 * `/minified/[MINIFIER_NAME]/[ORIGINAL_FILE_NAME].css`.
 *
 * @param {string} minifierName  The name of the minifier (csso, sass, etc)
 * @param {string} fileName      The original filename ('bttn-v0.2.4.css')
 * @param {string} result        The minified output to save ('a{color:red}')
 */
export const saveMinifiedFile = function (minifierName, fileName, result) {
  const folderPath = join(__dirname, '..', '..', 'minified', minifierName);
  const filePath = join(folderPath, fileName);
  mkdirSync(folderPath, { recursive: true });
  writeFileSync(filePath, result + '\n');
};

/**
 * Logs out a summary of information about the real-world tests after they run.
 *
 * @param {object[]} libraries  List of all real-world CSS libraries that were minified
 * @param {string[]} minifiers  List of all minifier names
 * @param {bigint}   startAll   Timestamp prior to running all realworld tests
 */
export const logRealWorldOutcome = function (libraries, minifiers, startAll) {
  const endAll = process.hrtime.bigint();
  const duration = durationNsToMs(startAll, endAll);
  console.log([
    libraries.length,
    'real world libraries minified by',
    minifiers.length,
    'minifiers in',
    formatMs(duration) + '.'
  ].join(' '));
};
