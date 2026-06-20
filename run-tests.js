/**
 * @file Loads all tests and minifiers, runs minifiers through tests, reports
 *       outcome in console, updates /data/*.json files, and creates webites.
 */

import {
  reportTestResults,
  totalsFromAllTests
} from './lib/reporters/allTests.js';
import { runAllTests } from './lib/runners/allTests.js';

const allTests = await runAllTests();
const results = totalsFromAllTests(allTests);
await reportTestResults(allTests, results);
