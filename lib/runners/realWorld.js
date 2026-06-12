import { minifiers } from '../loaders/loadAllMinifiers.js';
import { loadAllRealWorldTests } from '../loaders/loadAllRealWorldTests.js';
import {
  logRealWorldOutcome,
  updateRealWorldCachedResults
} from '../reporters/realWorld.js';
import { ERROR } from '../constants.js';
import { durationNsToMs } from '../helpers.js';
import { minify } from '../minify.js';

export const minifyAllRealWorldTests = async function () {
  const startAll = process.hrtime.bigint();
  const libraries = loadAllRealWorldTests();

  for (const minifier of minifiers) {
    for (const library of libraries) {
      // console.log({ minifier, library: library.name });
      library.results = library.results || {};
      library.duration = library.duration || {};
      let result = '';
      let error = false;
      const start = process.hrtime.bigint();
      try {
        result = await minify(minifier, library.source);
      } catch {
        error = true;
      }
      const end = process.hrtime.bigint();
      library.duration[minifier] = durationNsToMs(start, end);
      if (error) {
        library.results[minifier] = ERROR;
      } else {
        library.results[minifier] = result.length;
      }
    }
  }

  updateRealWorldCachedResults(libraries);
  logRealWorldOutcome(libraries, minifiers, startAll);
  return libraries;
};
