/**
 * @file Creates a genericized "minify" function for csskit.
 */
import { minify as wasmMinify } from 'csskit';

/**
 * Minifies a string of CSS by synchronously running it through
 * csskit's wasm function.
 *
 * @param  {string} source  Unminified CSS
 * @return {string}         Minified CSS
 */
export default function minify (source) {
  return wasmMinify(source);
}
