/**
 * @file Creates a genericized "minify" function for csskit.
 */
import { minify as min } from 'csskit';

/**
 * Minifies a string of CSS by synchronously running it through
 * csskit's native napi addon.
 *
 * @param  {string} source  Unminified CSS
 * @return {string}         Minified CSS
 */
export default function minify (source) {
  return min(source);
}
