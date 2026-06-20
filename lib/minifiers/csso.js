/**
 * @file Creates a genericized "minify" function for CSS Optimizer.
 */

import { minify as cssoMinify } from 'csso';

/**
 * Minifies a string of CSS using CSS Optimizer.
 *
 * @param  {string} source  Unminified CSS
 * @return {string}         Minified CSS
 */
export default function minify (source) {
  return cssoMinify(source).css;
}
