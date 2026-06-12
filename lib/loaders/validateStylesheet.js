import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import sass from "../minifiers/sass.js";

const __dirname = import.meta.dirname;

/**
 * Reads in the validate.css file and uses Sass to
 * both check for errors, and minifiy.
 *
 * @return {[type]} [description]
 */
const loadValidateStylesheet = function () {
  const validateCSS = join(__dirname, '..', '..', 'validate.css');
  let stylesheet;
  try {
    stylesheet = String(readFileSync(validateCSS));
    stylesheet = sass(stylesheet);
  } catch (error) {
    console.log({ error });
  }
  return stylesheet;
}

export const validateCss = loadValidateStylesheet();
