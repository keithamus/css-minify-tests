/**
 * @file Loads in all of the minification functions into a Map to allow looping
 *       over them in tests.
 */

import cleanCss from '../minifiers/clean-css.js';
import csskit from '../minifiers/csskit.js';
import csslop from '../minifiers/csslop.js';
import cssnano from '../minifiers/cssnano.js';
import csso from '../minifiers/csso.js';
import esbuild from '../minifiers/esbuild.js';
import lightningcss from '../minifiers/lightningcss.js';
import sass from '../minifiers/sass.js';

/**
 * The key is the npm package name, used for version lookups and displaying in
 * reports.
 *
 * @type {Map}
 */
export const registry = new Map([
  ['clean-css', cleanCss],
  ['csskit', csskit],
  ['csslop', csslop],
  ['cssnano', cssnano],
  ['csso', csso],
  ['esbuild', esbuild],
  ['lightningcss', lightningcss],
  ['sass', sass]
]);

/**
 * Names of all the minifier tools.
 *
 * @type {string[]}  ['clean-css', 'csskit', ...]
 */
export const minifiers = [...registry.keys()];

/**
 * Returns a minifier name's official orthographie including
 * correct capitalization.
 *
 * @param  {string} minifierName  The minifier name defined in the above registry
 * @return {string}               The official title-cased version
 */
export const getMinifierTitle = function (minifierName) {
  const minifierTitleNameMap = {
    'clean-css': 'CleanCSS',
    csskit: 'csskit',
    csslop: 'CSSLOP',
    cssnano: 'cssnano',
    csso: 'CSS Optimizer',
    esbuild: 'esbuild',
    lightningcss: 'Lightning CSS',
    sass: 'Sass'
  };
  return minifierTitleNameMap[minifierName] || minifierName;
};
