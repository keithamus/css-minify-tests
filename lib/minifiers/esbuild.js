/**
 * @file Creates a genericized "minify" function for esbuild.
 */

import { transform } from 'esbuild';

/**
 * Minifies a string of CSS using esbuild.
 *
 * @param  {string}          source  Unminified CSS
 * @return {Promise<string>}         Minified CSS
 */
export default async function minify (source) {
  const { code } = await transform(source, {
    loader: 'css',
    minify: true,
    target: [
      'chrome149',
      'firefox151',
      'safari26'
    ]
  });
  return code;
}
