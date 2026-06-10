/**
 * @file Loads in a list of real-world CSS files to be minified.
 */

import getRealWorldCSS from 'real-world-css-libraries';

/**
 * @typedef  {Object} REALLIBRARY
 * @property {string} fileName    The original filename, can be used as a unique ID
 * @property {string} name        Presentation-ready name, with spaces and capitals
 * @property {string} version     The version of the file, starting with 'v'
 * @property {string} license     Shortform Open Source license name used by the library
 * @property {string} source      The entire CSS file's contents as a string
 * @property {number} size        The filesize on disk, different than source.length
 * @property {string} url         The URL for where the file originated
 *
 * @example
 * {
 *   fileName: '960.gs-v0.0.0.css',
 *   name: '960.gs',
 *   version: 'v1.0.0',
 *   license: 'GPL-3.0 or MIT',
 *   source: '/*\n  960 Grid System ~ Core CSS.\n  Learn more ~ http://9...',
 *   size: 9989,
 *   url: 'https://github.com/nathansmith/960-Grid-System/blob/master/code/css/960.css'
 * }
 */

/**
 * Uses the real-world-css-libraries library to load in a 3rd-party list of
 * open source CSS files, along with meta-data about the files. Also filters
 * out CSS files that are known to have issues in this repo.
 *
 * @return {REALLIBRARY[]} Array of objects with information on each CSS file
 */
export const loadAllRealWorldTests = function () {
  let libraries = [];
  try {
    libraries = getRealWorldCSS();
  } catch (error) {
    console.log('Failed to read real-world CSS files.');
    console.log(error);
  }

  libraries = libraries.filter((library) => {
    // At this size limit these tests take around a minute,
    // without this they take hours.
    const fileIsReasonablySized = library.size < 500_000;

    const knownBads = [
      // Sass warns about deprecated @moz-document
      'GitHub-Windows',
      // Sass complains about incorrect hsla() syntax
      'Halfmoon',
      // Sass warns about deprecated darken()
      'Jupyter Themes'
    ];
    const fileIsKnownBad = knownBads.includes(library.name);

    return (
      fileIsReasonablySized &&
      !fileIsKnownBad
    );
  });

  return libraries;
};
