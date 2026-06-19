/**
 * @file Reads in all the test files from disk, returns sorted array of objects.
 */

import {
  readdirSync,
  readFileSync
} from 'node:fs';
import { join } from 'node:path';

import { validateCss } from './validateStylesheet.js';

const __dirname = import.meta.dirname;


/**
 * Sorts strings by comparing lowercased.
 *
 * @param  {string}  a  First item to compare
 * @param  {string}  b  Second item to compare
 * @return {booleam}    Truthy/falsy for Array.prototype.toSorted
 */
const customSort = function (a, b) {
  return (a.toLowerCase() > b.toLowerCase()) ? 1 : -1;
};

/**
 * Replaces a reference to a CSS file with the embedded and minifed version.
 *
 * @param  {string} testFile      The file name
 * @param  {string} fileContents  The contents of the file
 * @return {string}               The original contents, or a mutated version
 */
const inlineCss = function (testFile, fileContents) {
  if (testFile === 'validate.html') {
    return fileContents.replace(
      `<link rel="stylesheet" href="../../../validate.css">`,
      `<style>${validateCss}</style>`
    );
  }
  return fileContents;
}

/**
 * @typedef  {Object} TESTDATA
 * @property {string} groupName   Category name test type (anchor, colors, etc)
 * @property {string} testNumber  Which test in the category (0001, 0002, etc)
 * @property {string} source      The contents of the "source.css" file
 * @property {string} expected    The contents of the "expected.css" file
 * @property {string} readme      The contents of the "README.md" file
 * @property {string} [validate]  The contents of the "validate.html" file
 * @property {object} durations   An empty object to store minifier run times
 * @property {object} actual      An empty object to store the minifier outputs
 * @property {object} errors      An empty object to store minifier errors
 */

/**
 * Synchronously loads in a sorted list of all tests as objects containing the
 * test group, test number, and all associated files.
 *
 * @return {TESTDATA[]} Array of all test data from the '/tests' folder
 */
export const loadAllTests = function () {
  const allTests = [];

  // '/tests'
  const testsFolder = join(__dirname, '..', '..', 'tests');

  // ['anchor', 'charset', 'colors', ...]
  const testGroups = readdirSync(testsFolder).sort(customSort);
  for (const testGroup of testGroups) {
    // '/tests/anchor'
    const testGroupFolder = join(testsFolder, testGroup);

    // ['0001', '0002', '0003', ...]
    const numberedTests = readdirSync(testGroupFolder).sort(customSort);
    for (const numberedTest of numberedTests) {
      const testData = {
        // 'anchor'
        groupName: testGroup,
        // '0001'
        testNumber: numberedTest
      };

      // '/tests/anchor/0001'
      const numberedTestFolder = join(testGroupFolder, numberedTest);

      // ['expected.css', 'README.md', ...]
      const testFiles = readdirSync(numberedTestFolder).sort(customSort);
      for (const testFile of testFiles) {
        // 'tests/anchor/0001/expected.css'
        const fullPath = join(numberedTestFolder, testFile);
        // 'a{position-area:center}\n' => 'a{position-area:center}'
        let fileContents = String(readFileSync(fullPath)).trim();
        fileContents = inlineCss(testFile, fileContents);

        // 'README.md' => 'readme'
        const name = testFile.toLowerCase().split('.')[0];
        testData[name] = fileContents;
      }

      // Storage for minifier test results
      testData.durations = {};
      testData.actual = {};
      testData.errors = {};

      allTests.push(testData);
    }
  }

  return allTests;
};
