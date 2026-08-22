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
 * Updates the /data/real-world-results.json file with the results from the most
 * recent running of all minifiers against the real-world-css-libraries repo.
 *
 * @param {object[]} libraries  List of all real-world CSS libraries that were minified
 */
export const updateRealWorldCachedResults = function (libraries) {
  const jsonLibraries = [];
  const totals = {
    name: 'TOTALS',
    version: 'v0.0.0',
    size: 0,
    results: {}
  };
  for (const library of libraries) {
    const size = library.source.length;
    jsonLibraries.push({
      name: library.name,
      version: library.version,
      size,
      results: {
        ...library.results
      }
    });

    // Update totals
    totals.size = totals.size + size;
    for (const minifierName in library.results) {
      const libraryResult = library.results[minifierName];
      const currentTotal = (totals.results[minifierName] || 0);
      if (typeof(libraryResult) === 'number') {
        totals.results[minifierName] = currentTotal + libraryResult;
      }
    }
  }
  jsonLibraries.unshift(totals);

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
