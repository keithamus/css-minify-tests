/**
 * @file Creates a genericized "minify" function for cssnano.
 */

import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import advancedPreset from 'cssnano-preset-advanced';
import postcss from 'postcss';

const processor = postcss([
  cssnano({
    preset: advancedPreset({
      // Potentially incorrect behavior, breaks several tests
      cssDeclarationSorter: false,
      // Removes @font-face declarations that are commonly used in other files
      discardUnused: false,
      // Deletes duplicate keyframes and redirects keyframe references
      mergeIdents: false,
      // Replaces keyframe names with "a"
      reduceIdents: false,
      // Changes `z-index: 5000` to `z-index: 1`
      zindex: false
    }),
    plugins: [autoprefixer]
  })
]);

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
