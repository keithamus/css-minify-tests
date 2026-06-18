/**
 * @file Runs all minifiers against real world CSS files and records outcomes.
 */

import { ERROR } from '../constants.js';
import { durationNsToMs } from '../helpers.js';
import { minifiers } from '../loaders/loadAllMinifiers.js';
import { loadAllRealWorldTests } from '../loaders/loadAllRealWorldTests.js';
import { minify } from '../minify.js';
import {
  logRealWorldOutcome,
  updateRealWorldCachedResults
} from '../reporters/realWorld.js';

/**
 * Runs all minifiers against all Real-World CSS libraries, timing each run and
 * recording the size of the minified output.
 *
 * @return {object[]} Array of library objects with appended results
 */
export const minifyAllRealWorldTests = async function () {
  const startAll = process.hrtime.bigint();
  const libraries = loadAllRealWorldTests();

  for (const minifier of minifiers) {
    for (const library of libraries) {
      library.results = library.results || {};
      library.duration = library.duration || {};
      let result = '';
      let error = false;
      const start = process.hrtime.bigint();
      try {
        result = await minify(minifier, library.source);
        result = result.trim();
      } catch {
        error = true;
      }
      const end = process.hrtime.bigint();
      library.duration[minifier] = durationNsToMs(start, end);
      if (error) {
        library.results[minifier] = ERROR;
      } else {
        library.results[minifier] = result.length;
      }
    }
  }

  updateRealWorldCachedResults(libraries);
  logRealWorldOutcome(libraries, minifiers, startAll);
  return libraries;
};
