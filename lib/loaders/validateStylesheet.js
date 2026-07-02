/**
 * @file Loads in the /validate.css as a string.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import sass from '../minifiers/sass.js';

const __dirname = import.meta.dirname;

/**
 * Reads in the validate.css file and uses Sass to
 * both check for errors, and minifiy.
 *
 * @return {string} The CSS as a minified string
 */
const loadValidateStylesheet = async function () {
  const validateCSS = join(__dirname, '..', '..', 'validate.css');
  let stylesheet;
  try {
    stylesheet = String(readFileSync(validateCSS));
    stylesheet = await sass(stylesheet);
    stylesheet = stylesheet.trim();
  } catch (error) {
    console.log({ error });
  }
  return stylesheet;
};

export const validateCss = await loadValidateStylesheet();
