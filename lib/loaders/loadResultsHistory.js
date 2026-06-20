/**
 * @file Loads in the `/data/results-history.json` file.
 */

import { readFileSync } from 'node:fs';

import { HISTORY_PATH } from '../constants.js';

/**
 * Reads and parses the `/data/results-history.json` file.
 *
 * @return {object} The parsed JSON object from the file
 */
export function readHistory () {
  try {
    return JSON.parse(readFileSync(HISTORY_PATH));
  } catch {
    return [];
  }
}
