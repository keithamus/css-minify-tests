/**
 * @file Logic related to reporting or storing the results of real-world test runs.
 */

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  durationNsToMs,
  formatMs
} from '../helpers.js';

const __dirname = import.meta.dirname;

/**
 * Updates the /data/real-world-results.json file with the results from the most
 * recent running of all minifiers against the real-world-css-libraries repo.
 *
 * @param {object[]} libraries  List of all real-world CSS libraries that were minified
 */
export const updateRealWorldCachedResults = function (libraries) {
  const jsonLibraries = [];
  for (const library of libraries) {
    jsonLibraries.push({
      name: library.name,
      version: library.version,
      size: library.source.length,
      results: {
        ...library.results
      }
    });
  }

  const oututFile = join(__dirname, '..', '..', 'data', 'real-world-results.json');
  const output = JSON.stringify(jsonLibraries, null, 2);
  writeFileSync(oututFile, output + '\n');
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
