/**
 * @file Shared generic helper functions.
 */

import prettyMilliseconds from 'pretty-ms';

/**
 * Calculates a duration in nanoseconds.
 * Converts nanoseconds to milliseconds.
 * Returns milliseconds.
 *
 * @param  {BigInt} start  Start time stamp
 * @param  {BigInt} end    End time stamp
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

export const html = function (strings, ...values) {
  return String.raw({ raw: strings }, ...values);
};
