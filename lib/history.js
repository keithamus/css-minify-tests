/**
 * @file Prepends the latest test results to the /data/results-history.json file.
 */

import { writeFileSync } from 'node:fs';

import { HISTORY_PATH } from './constants.js';
import { minifiers } from './loaders/loadAllMinifiers.js';
import { readHistory } from './loaders/loadResultsHistory.js';

/**
 * Adds a new history object on results-history.json to track changes in
 * minifier test results over time (used by the history chart on the website).
 * If most recent results match what was last prepended to the history file,
 * this just updates the time stamp, rather than adding a new identical entry.
 *
 * @param  {object[]} allTests  All tests, their details, and individual results
 * @param  {object}   results   The cached totals of the results
 * @param  {object}   versions  The minifier version numbers
 * @return {object[]}           List of historical run results
 */
export function prependHistory (allTests, results, versions) {
  const history = readHistory();

  const entry = {
    date: new Date().toISOString(),
    testCount: 0,
    minifiers: {}
  };

  for (const minifierName of minifiers) {
    entry.minifiers[minifierName] = {
      version: versions[minifierName] || null,
      pass: results.totals[minifierName].pass,
      total: allTests.length
    };
    entry.testCount = allTests.length;
  }

  // Dedup: if latest entry has same versions + same test count, overwrite it
  if (history.length > 0) {
    const latest = history[0];
    const same = (
      latest.testCount === entry.testCount &&
      Object.keys(entry.minifiers).every((name) => {
        const prev = latest.minifiers[name];
        const curr = entry.minifiers[name];
        return (
          prev &&
          curr &&
          prev.version === curr.version
        );
      }) &&
      Object.keys(latest.minifiers).every((name) => entry.minifiers[name])
    );

    if (same) {
      history[0] = entry;
    } else {
      history.unshift(entry);
    }
  } else {
    history.unshift(entry);
  }

  writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2) + '\n');
  return history;
}
