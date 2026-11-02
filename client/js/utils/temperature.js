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
  if (tempC === null || tempC === undefined || isNaN(Number(tempC))) {
    return 0;
  }
  const numericTemp = Number(tempC);
  if (unit === "F") {
    return Math.round((numericTemp * 9) / 5 + 32);
  }
  return Math.round(numericTemp);
}

/**
 * Formats a temperature in Celsius into a rounded numeric string according to target unit.
 * 
 * @param {number} tempC - Temperature in degrees Celsius.
 * @param {"C"|"F"} [unit="C"] - Target temperature unit.
 * @returns {string} Formatted temperature string or dash if missing.
 */
export function formatTemp(tempC, unit = "C") {
  if (tempC === null || tempC === undefined || isNaN(Number(tempC))) {
    return "—";
  }
  return String(convertTemp(tempC, unit));
}
