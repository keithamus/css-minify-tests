/**
 * @file Creates a genericized "minify" function for LightningCSS.
 */

import {
  browserslistToTargets,
  transform
} from 'lightningcss';

const targets = browserslistToTargets([
  'last 1 Chrome version',
  'last 1 Firefox version',
  'last 1 Safari version'
]);

/**
 * Minifies a string of CSS using LightningCSS.
 *
 * @param  {string} source  Unminified CSS
 * @return {string}         Minified CSS
 */
export default function minify (source) {
  const { code } = transform({
    filename: 'test.css',
    code: Buffer.from(source),
    minify: true,
    targets
  });
  return new TextDecoder().decode(code);
}
