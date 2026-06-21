/**
 * @file Storage for constants.
 */

import { join } from 'node:path';

const __dirname = import.meta.dirname;

export const CHECKMARK = '&#10003;'; // ✓
export const CROSS_MARK = '&#10007;'; // ✗
export const ERROR = 'ERROR';
export const HEAVY_X = '&#x2716;'; // ✖️
export const HISTORY_PATH = join(__dirname, '..', 'data', 'results-history.json');
