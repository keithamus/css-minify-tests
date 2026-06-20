/**
 * @file Runs all tests across all minifiers.
 */

import { durationNsToMs } from '../helpers.js';
import { minifiers } from '../loaders/loadAllMinifiers.js';
import { loadAllTests } from '../loaders/loadAllTests.js';
import { minify } from '../minify.js';

/**
 * @typedef  {object} RANTEST
 * @property {string} groupName   Category name test type (anchor, colors, etc)
 * @property {string} testNumber  Which test in the category (0001, 0002, etc)
 * @property {string} source      The contents of the "source.css" file
 * @property {string} expected    The contents of the "expected.css" file
 * @property {string} readme      The contents of the "README.md" file
 * @property {string} [validate]  The contents of the "validate.html" file
 * @property {object} durations   An object with minifier names as key and run times as value
 * @property {object} actual      An object with minifier names as key and minified outputs as value
 * @property {object} errors      An object with minifier names as key and errors as value
 */

/**
 * Runs all of the tests in the  `/tests` folder tracking the test
 * duration, the outcome, and any errors that occur.
 *
 * @return {RANTEST[]} Array of test objects including the test results
 */
export const runAllTests = async function () {
  const allTests = loadAllTests();
  // Separate loop just for running so benchmark is accurate
  for (const minifierName of minifiers) {
    for (const test of allTests) {
      let actual;
      let error;
      const start = process.hrtime.bigint();
      try {
        actual = await minify(minifierName, test.source);
        actual = actual.trim();
      } catch (err) {
        error = err?.message || String(err);
        actual = null;
      }
      const end = process.hrtime.bigint();
      const duration = durationNsToMs(start, end);
      test.durations[minifierName] = duration;
      test.actual[minifierName] = actual;
      test.errors[minifierName] = error;
    }
  }
  return allTests;
};
