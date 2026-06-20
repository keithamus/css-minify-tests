/* eslint-disable jsdoc/reject-any-type */

/**
 * @file Shared generic helper functions.
 */

import prettyMilliseconds from 'pretty-ms';

/**
 * Calculates a duration in nanoseconds.
 * Converts nanoseconds to milliseconds.
 * Returns milliseconds.
 *
 * @param  {bigint} start  Start time stamp
 * @param  {bigint} end    End time stamp
 * @return {number}        Total duration in ms
 */
export const durationNsToMs = function (start, end) {
  return Number(end - start) / 1e6;
};

/**
 * Formats the time for display.
 *
 * @param  {number} duration  Time in ms
 * @return {string}           Formatted time
 */
export const formatMs = function (duration) {
  const options = {
    keepDecimalsOnWholeSeconds: true,
    secondsDecimalDigits: 3
  };
  const time = prettyMilliseconds(duration, options);
  return time;
};

/**
 * Used to apply better syntax highlighting for strings of markup.
 *
 * @param  {string[]} strings  Static string content
 * @param  {any[]}    values   Dynamic values in template literals
 * @return {string}            Markup string
 */
export const html = function (strings, ...values) {
  return String.raw({ raw: strings }, ...values);
};
