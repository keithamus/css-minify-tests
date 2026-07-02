/**
 * @file Creates a genericized "minify" function for Sass.
 */

import {
  compileStringAsync,
  Logger
} from 'sass';

/**
 * Minifies a string of CSS using the Sass processor.
 *
 * @param  {string}          source  Unminified CSS
 * @return {Promise<string>}         Minified CSS
 */
export default async function minify (source) {
  const options = {
    // Removes ASCII CLI color codes from warnings
    alertColor: false,
    // Quiets console warnings
    logger: Logger.silent,
    // Removes warnings caused by dependencies
    quietDeps: true,
    // This tells Sass to minify the output
    style: 'compressed'
  };
  const result = await compileStringAsync(source, options);
  return result.css;
}
