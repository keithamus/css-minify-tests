import {
  reportTestResults,
  totalsFromAllTests
} from './lib/reporters/allTests.js';
import { runAllTests } from './lib/runners/allTests.js';

const allTests = await runAllTests();
const results = totalsFromAllTests(allTests);
await reportTestResults(allTests, results);
