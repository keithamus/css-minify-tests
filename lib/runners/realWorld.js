import { minifiers } from '../loaders/loadAllMinifiers.js';
import { loadAllRealWorldTests } from '../loaders/loadAllRealWorldTests.js';
import {
  logRealWorldOutcome,
  saveMinifiedFile,
  updateRealWorldCachedResults
} from '../reporters/realWorld.js';
import { ERROR } from '../constants.js';
import { durationNsToMs } from '../helpers.js';
import { minify } from '../minify.js';

export const minifyAllRealWorldTests = async function () {
  const startAll = process.hrtime.bigint();
  const libraries = loadAllRealWorldTests();

  for (const minifierName of minifiers) {
    for (const library of libraries) {
      library.results = library.results || {};
      library.duration = library.duration || {};
      let result = '';
      let errorMessage = '';
      let errorOccurred = false;
      const start = process.hrtime.bigint();
      try {
        result = await minify(minifierName, library.source);
        result = result.trim();
      } catch (error) {
        errorMessage = error?.message && String(error.message);
        errorOccurred = true;
      }
      const end = process.hrtime.bigint();
      library.duration[minifierName] = durationNsToMs(start, end);
      if (errorOccurred) {
        library.results[minifierName] = ERROR;
      } else {
        library.results[minifierName] = result.length;
      }
      saveMinifiedFile(minifierName, library.fileName, (result || errorMessage));
    }
  }

  updateRealWorldCachedResults(libraries);
  logRealWorldOutcome(libraries, minifiers, startAll);
  return libraries;
};
