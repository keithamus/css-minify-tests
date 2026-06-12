/**
 * @file Shared generic helper functions.
 */

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
