/**
 * @file Creates a genericized "minify" function for cssnano.
 */

import cssnano from 'cssnano';
import postcss from 'postcss';

const processor = postcss([cssnano]);

/**
 * Minifies a string of CSS using cssnano and Post-CSS.
 *
 * @param  {string}          source  Unminified CSS
 * @return {Promise<string>}         Minified CSS
 */
export default async function minify (source) {
  const result = await processor.process(source, { from: undefined });
  return result.css;
}
