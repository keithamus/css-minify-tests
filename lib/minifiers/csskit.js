/**
 * @file Creates a genericized "minify" function for csskit.
 */
/* eslint-disable-next-line import-x/extensions */
import { minify as csskit } from 'csskit/bundle';

/**
 * Synchronously minifies a string of CSS using CSSKit.
 *
 * @param  {string} source  Unminified CSS
 * @return {string}         Minified CSS
 */
export default function minify (source) {
  return csskit(source);
}
