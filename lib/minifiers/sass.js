/**
 * @file Creates a genericized "minify" function for Sass.
 */

import { compileString } from 'sass';

/**
 * Minifies a string of CSS using the Sass processor.
 *
 * @param  {string} source  Unminified CSS
 * @return {string}         Minified CSS
 */
export default function minify (source) {
  const options = {
    style: 'compressed',
    alertColor: false
  };
  return compileString(source, options).css;
}
