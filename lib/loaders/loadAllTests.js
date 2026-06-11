/**
 * @file Reads in all the test files from disk, returns sorted array of objects.
 */

import {
  readdirSync,
  readFileSync
} from 'node:fs';
import { join } from 'node:path';

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
 * @typedef  {Object} TESTDATA
 * @property {string} testGroup   Category name test type (anchor, colors, etc)
 * @property {string} testNumber  Which test in the category (0001, 0002, etc)
 * @property {string} source      The contents of the "source.css" file
 * @property {string} expected    The contents of the "expected.css" file
 * @property {string} readme      The contents of the "README.md" file
 * @property {string} [validate]  The contents of the "validate.html" file
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
        testGroup,
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
        const fileContents = String(readFileSync(fullPath)).trim();

        // 'README.md' => 'readme'
        const name = testFile.toLowerCase().split('.')[0];

        testData[name] = fileContents;
      }

      allTests.push(testData);
    }
  }

  return allTests;
};
