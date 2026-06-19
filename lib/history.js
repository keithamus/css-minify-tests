import fs from 'node:fs/promises';

import { minifiers } from './loaders/loadAllMinifiers.js';
import { readHistory } from './loaders/loadResultsHistory.js';
import { HISTORY_PATH } from './constants.js';

export async function appendHistory (allTests, results, versions) {
  const history = await readHistory();

  const entry = {
    date: new Date().toISOString(),
    testCount: 0,
    minifiers: {},
  };

  for (const minifierName of minifiers) {
    entry.minifiers[minifierName] = {
      version: versions[minifierName] || null,
      pass: results.totals[minifierName].pass,
      total: allTests.length,
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

  await fs.writeFile(HISTORY_PATH, JSON.stringify(history, null, 2) + '\n');
  return history;
}
