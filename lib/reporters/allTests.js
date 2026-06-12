import fs from 'node:fs/promises';
import path from 'node:path';

import { minifiers } from '../loaders/loadAllMinifiers.js';
import { appendHistory } from '../history.js';
import { getVersions } from '../minify.js';
import { resultsAsHTML } from '../results-as-html.js';

const __dirname = import.meta.dirname;

/**
 * @typedef  {Object} MINIFIERTOTAL
 * @property {number} durations      Total duration time spent across all tests by the minifier
 * @property {number} pass           Total tests that the minifier passed
 * @property {number} errors         Total number of errors the minifier had when running the tests
 */
/**
 * @typedef  {Object<string, MINIFIERTOTAL>} TOTALS
 */

/**
 * @typedef  {Object} MINIFIERGROUP
 * @property {number} pass           Total tests that the minifier passed in this specific group
 */
/**
 * @typedef  {Object<string, MINIFIERGROUP>} MINIFIERGROUPS  Keys are minifier names (csso, sass, etc)
 */
/**
 * @typedef  {Object<string, MINIFIERGROUPS>} GROUP  Keys are group names ('anchor', etc)
 */

/**
 * @typedef  {Object} RESULTS
 * @property {TOTALS} totals   The keys are the names of minifiers, the values are objects of their totals
 * @property {GROUP}  groups   The keys are the names of groups, the values are objects of minifier totals
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

export const reportTestResults = async function (allTests, results) {
  const debugMode = !!process.env.DEBUG;
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
    process.stdout.write(padCenter('─'.repeat(minifierName.length + 2), colWidth));
  }
  console.log();

  process.stdout.write(pad('TOTAL', testColWidth));
  for (const minifierName of minifiers) {
    const result = results.totals[minifierName];
    process.stdout.write(padCenter(result.pass + ' / ' + allTests.length, colWidth));
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
      process.stdout.write(padCenter(result.pass + '/' + groupTotal, colWidth));
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
  const history = await appendHistory(allTests, results, versions);
  await resultsAsHTML(allTests, results, versions, history, 'index.html');
  console.log('HTML report written to index.html');
  const resultsJson = {};
  for (const test of allTests) {
    const fullTestName = test.groupName + '/' + test.testNumber;
    resultsJson[fullTestName] = {};
    const expected = test.expected
    for (const minifierName in test.actual) {
      const actual = test.actual[minifierName];
      resultsJson[fullTestName][minifierName] = expected === actual;
    }
  }

  const outputFile = path.join(__dirname, '..', '..', 'data', 'results.json');
  await fs.writeFile(outputFile, JSON.stringify(resultsJson, null, 2) + '\n');
};
