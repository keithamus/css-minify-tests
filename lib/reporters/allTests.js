/**
 * @file Console reports and /data/*.json file updating based on the results of
 *        running the minifiers against the /tests folder.
 */

import fs from 'node:fs/promises';
import path from 'node:path';

import { prependHistory } from '../history.js';
import { minifiers } from '../loaders/loadAllMinifiers.js';
import { getVersions } from '../loaders/loadVersions.js';
import { resultsAsHTML } from '../results-as-html.js';

const __dirname = import.meta.dirname;

/**
 * @typedef  {object} MINIFIERTOTAL
 * @property {number} durations      Total duration time spent across all tests
 *                                   by the minifier
 * @property {number} pass           Total tests that the minifier passed
 * @property {number} errors         Total number of errors the minifier had
 *                                   when running the tests
 */
/**
 * @typedef  {object} MINIFIERGROUP
 * @property {number} pass           Total tests that the minifier passed in
 *                                   this specific group
 */

/* eslint-disable jsdoc/check-types */
/** @typedef {object<string, MINIFIERTOTAL>} TOTALS */
/**
 * @typedef {object<string, MINIFIERGROUP>} MINIFIERGROUPS  Keys are minifier
 *                                                          names (csso, etc.)
 */
/**
 * @typedef {object<string, MINIFIERGROUPS>} GROUP  Keys are group names
 *                                                  ('anchor', 'nesting',cd etc.)
 */
/* eslint-enable jsdoc/check-types */

/**
 * @typedef  {object} RESULTS
 * @property {TOTALS} totals   The keys are the names of minifiers, the values
 *                             are objects of their totals
 * @property {GROUP}  groups   The keys are the names of groups, the values are
 *                             objects of minifier totals
 */

/**
 * Loops over all tests to look at individual test results adding them up into
 * totals for how many tests a minifier passed overall, it's over all durations,
 * and errors. Along with the subtotals for each group.
 *
 * @param  {object[]} allTests  All tests, their details, and individual results
 * @return {RESULTS}            Result totals and group subtotals
 */
export const totalsFromAllTests = function (allTests) {
  const results = {
    totals: {},
    groups: {}
  };
  // Separate loop for reporting data
  for (const minifierName of minifiers) {
    for (const test of allTests) {
      results.totals[minifierName] = results.totals[minifierName] || {};
      results.totals[minifierName].pass = results.totals[minifierName].pass || 0;
      results.groups[test.groupName] = results.groups[test.groupName] || {};
      results.groups[test.groupName][minifierName] = (
        results.groups[test.groupName][minifierName] ||
        {}
      );
      results.groups[test.groupName][minifierName].pass = (
        results.groups[test.groupName][minifierName].pass ||
        0
      );

      results.totals[minifierName].durations = (
        (results.totals[minifierName].durations || 0) +
        test.durations[minifierName]
      );
      if (
        typeof(test.actual[minifierName]) === 'string' &&
        test.actual[minifierName] === test.expected
      ) {
        results.totals[minifierName].pass++;
        results.groups[test.groupName][minifierName].pass++;
      }
      if (test.errors[minifierName]) {
        results.totals[minifierName].errors = (
          (results.totals[minifierName].errors || 0) + 1
        );
      }
    }
  }
  return results;
};

/**
 * Logs out a table of results for the core minification tests found in /tests.
 * Also updates /data/results.json.
 *
 * @param {object[]} allTests  All tests, their details, and individual results
 * @param {RESULTS}  results   Result totals and group subtotals
 */
export const reportTestResults = async function (allTests, results) {
  const debugInfo = [];

  console.log('\nCSS Minify Tests\n');

  const colWidth = 14;
  const groupNames = Array.from(new Set(allTests.map((test) => {
    return test.groupName;
  })));
  let testColWidth = 0;
  for (const groupName of groupNames) {
    if (testColWidth < groupName.length) {
      testColWidth = groupName.length;
    }
  }

  function pad (str, width) {
    return String(str).padEnd(width);
  }

  function padCenter (str, width) {
    str = String(str);
    const left = Math.floor((width - str.length) / 2);
    return (
      ' '.repeat(Math.max(0, left)) +
      str +
      ' '.repeat(Math.max(0, width - str.length - left))
    );
  }

  process.stdout.write(pad('', testColWidth));
  for (const minifierName of minifiers) {
    process.stdout.write(padCenter(minifierName, colWidth));
  }
  console.log();

  process.stdout.write(pad('', testColWidth));
  for (const minifierName of minifiers) {
    const amountOfDashes = '─'.repeat(minifierName.length + 2);
    process.stdout.write(padCenter(amountOfDashes, colWidth));
  }
  console.log();

  process.stdout.write(pad('TOTAL', testColWidth));
  for (const minifierName of minifiers) {
    const result = results.totals[minifierName];
    const resultPresentation = result.pass + ' / ' + allTests.length;
    process.stdout.write(padCenter(resultPresentation, colWidth));
  }
  console.log();
  console.log();

  for (const groupName of groupNames) {
    const groupTotal = allTests
      .filter((test) => {
        return test.groupName === groupName;
      })
      .length;
    process.stdout.write(pad(groupName, testColWidth));
    for (const minifierName of minifiers) {
      const result = results.groups[groupName][minifierName];
      const subTotal = result.pass + '/' + groupTotal;
      process.stdout.write(padCenter(subTotal, colWidth));
    }
    console.log();
  }

  console.log();

  if (debugInfo.length > 0) {
    console.log('Mismatches:\n');
    for (const info of debugInfo) {
      console.log(`  ${info.minifier} | ${info.test}`);
      console.log(`    expected: ${JSON.stringify(info.expected)}`);
      console.log(`    actual:   ${JSON.stringify(info.actual)}`);
      console.log();
    }
  }

  const versions = getVersions(minifiers);
  const history = await prependHistory(allTests, results, versions);
  await resultsAsHTML(allTests, results, versions, history, 'index.html');
  console.log('HTML report written to index.html');
  const resultsJson = {};
  for (const test of allTests) {
    const fullTestName = test.groupName + '/' + test.testNumber;
    resultsJson[fullTestName] = {};
    const expected = test.expected;
    for (const minifierName in test.actual) {
      const actual = test.actual[minifierName];
      resultsJson[fullTestName][minifierName] = expected === actual;
    }
  }

  const outputFile = path.join(__dirname, '..', '..', 'data', 'results.json');
  await fs.writeFile(outputFile, JSON.stringify(resultsJson, null, 2) + '\n');
};
