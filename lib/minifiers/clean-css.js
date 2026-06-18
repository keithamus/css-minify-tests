/**
 * @file Creates a genericized "minify" function for clean-css.
 */

import CleanCSS from 'clean-css';

const instance = new CleanCSS({
  level: 2,
  inline: false
});

/**
 * Takes in a string of CSS and minifies it using clean-css.
 *
 * @param  {string} source  Unminified CSS
 * @return {string}         Minified CSS
 */
export default function minify (source) {
  const result = instance.minify(source);
  if (result.errors?.length) {
    throw new Error(result.errors.join('\n'));
  }
  return result.styles;
}
