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
 * @callback                   MINIFY
 * @param    {string}          inputCSS  The input CSS to be minified
 * @return   {Promise<string>}           The minified CSS output
 */

/**
 * @typedef  {object} ENTRY
 * @property {string} title   The minifier name's official orthographie
 * @property {string} url     The URL to the minifier's online playground/site
 * @property {MINIFY} minify  The async minification function for benchmarking
 */

/* eslint-disable-next-line jsdoc/check-types */
/** @typedef {object<string, ENTRY>} REGISTRY */

/**
 * The key is the npm package name, used for version lookups and displaying in
 * reports.
 *
 * @type {REGISTRY}
 */
export const registry = Object.freeze({
  'clean-css': {
    title: 'CleanCSS',
    url: 'https://clean-css.github.io',
    minify: cleanCss
  },
  csskit: {
    title: 'csskit',
    url: 'https://csskit.rs/playground',
    minify: csskit
  },
  csslop: {
    title: 'CSSLOP',
    url: 'https://thejaredwilcurt.com/csslop',
    minify: csslop
  },
  cssnano: {
    title: 'cssnano',
    url: 'https://cssnano.github.io/cssnano/playground',
    minify: cssnano
  },
  csso: {
    title: 'CSS Optimizer',
    url: 'https://css.github.io/csso/csso.html',
    minify: csso
  },
  esbuild: {
    title: 'esbuild',
    url: 'https://esbuild.github.io/try/#YgAwLjI4LjEAZmlsZS5jc3MgLS1taW5pZnkAAGZpbGUuY3NzAA',
    minify: esbuild
  },
  lightningcss: {
    title: 'Lightning CSS',
    url: 'https://lightningcss.dev/playground',
    minify: lightningcss
  },
  sass: {
    title: 'Sass',
    url: 'https://sass-lang.com/playground/#eJwzNAAAAJQAYg==',
    minify: sass
  }
});

/**
 * Names of all the minifier tools.
 *
 * @type {string[]}  ['clean-css', 'csskit', ...]
 */
export const minifiers = Object.keys(registry);

/**
 * Returns a minifier name's official orthographie including
 * correct capitalization.
 *
 * @param  {string} minifierName  The minifier name defined in the above registry
 * @return {string}               The official title-cased version
 */
export const getMinifierTitle = function (minifierName) {
  return registry[minifierName]?.title || minifierName;
};

/**
 * Returns a link to the official website for the minifier, with their
 * interactive online playground for users to try out.
 *
 * @param  {string} minifierName  The minifier name defined in the above registry
 * @return {string}               The URL to the minifiers website/playground
 */
export const getMinifierUrl = function (minifierName) {
  if (!registry[minifierName]?.url) {
    throw 'MISSING ' + minifierName + ' FROM LIST IN getMinifierUrl FUNCTION';
  }
  return registry[minifierName].url;
};
