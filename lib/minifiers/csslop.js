/**
 * @file Creates a genericized "minify" function for CSSLOP.
 */

import { minifyCSS } from '@thejaredwilcurt/csslop';

/**
 * Minifies a string of CSS using CSSLOP.
 *
 * @param  {string} source  Unminified CSS
 * @return {string}         Minified CSS
 */
export default function minify (source) {
  return minifyCSS(source);
}
