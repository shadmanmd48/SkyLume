/**
 * @file temperature.js
 * @description Temperature conversion and formatting functions.
 */

/**
 * Converts a temperature in Celsius to the specified target unit ("C" or "F").
 * Returns the converted numeric value rounded to the nearest integer.
 * 
 * @param {number} tempC - Temperature in degrees Celsius.
 * @param {"C"|"F"} [unit="C"] - Target temperature unit.
 * @returns {number} Converted and rounded temperature.
 */
export function convertTemp(tempC, unit = "C") {
  if (unit === "F") {
    return Math.round((tempC * 9) / 5 + 32);
  }
  return Math.round(tempC);
}

/**
 * Formats a temperature in Celsius into a rounded numeric string according to target unit.
 * 
 * @param {number} tempC - Temperature in degrees Celsius.
 * @param {"C"|"F"} [unit="C"] - Target temperature unit.
 * @returns {string} Formatted temperature string.
 */
export function formatTemp(tempC, unit = "C") {
  return String(convertTemp(tempC, unit));
}
