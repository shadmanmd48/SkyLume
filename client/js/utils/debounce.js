/**
 * @file debounce.js
 * @description Function execution debouncer utility.
 */

/**
 * Returns a debounced version of a function that delays execution until waitMs
 * milliseconds have passed since its last invocation.
 * 
 * @param {Function} fn - The function to debounce.
 * @param {number} waitMs - Delay duration in milliseconds.
 * @returns {Function} Debounced function.
 */
export function debounce(fn, waitMs) {
  let timeoutId = null;

  return (...args) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, waitMs);
  };
}
