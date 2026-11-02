/**
 * @file storage.js
 * @description Safe localStorage service with try/catch guards and schema validation.
 */

import { CONFIG } from "../config.js";

/**
 * Safely loads and parses a JSON value from localStorage.
 * 
 * @param {string} key - Full storage key.
 * @param {*} [fallback=null] - Default fallback value if read/parse fails.
 * @returns {*} Stored value or fallback.
 */
export function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return fallback;
    }
    return JSON.parse(raw);
  } catch (err) {
    return fallback;
  }
}

/**
 * Safely stringifies and saves a value to localStorage.
 * 
 * @param {string} key - Full storage key.
 * @param {*} value - Value to serialize and store.
 * @returns {void}
 */
export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // Suppress quota and private browsing storage exceptions
  }
}

/**
 * Loads the saved cities list from localStorage.
 * Validates that each item contains string `id` and `city` properties.
 * 
 * @returns {Array<Object>|null} Array of saved city items, or null on first visit.
 */
export function loadSaved() {
  const data = load(`${CONFIG.STORAGE_PREFIX}saved`, null);

  if (data === null) {
    return null;
  }

  if (Array.isArray(data)) {
    const isValid = data.every(
      (item) => item && typeof item === "object" && typeof item.id === "string" && typeof item.city === "string"
    );
    if (isValid) {
      return data;
    }
  }

  return [];
}

/**
 * Persists the saved cities list to storage.
 * 
 * @param {Array<Object>} list - Array of saved city objects.
 * @returns {void}
 */
export function saveSaved(list) {
  const sanitized = Array.isArray(list)
    ? list.filter((item) => item && typeof item === "object" && typeof item.id === "string")
    : [];
  save(`${CONFIG.STORAGE_PREFIX}saved`, sanitized);
}

/**
 * Loads recent city search IDs from storage.
 * 
 * @returns {string[]} Array of recent city IDs capped to CONFIG.RECENT_LIMIT.
 */
export function loadRecent() {
  const data = load(`${CONFIG.STORAGE_PREFIX}recent`, []);

  if (Array.isArray(data)) {
    return data
      .filter((item) => typeof item === "string" && item.trim().length > 0)
      .slice(0, CONFIG.RECENT_LIMIT);
  }

  return [];
}

/**
 * Persists recent city search IDs to storage.
 * 
 * @param {string[]} list - Array of recent city IDs.
 * @returns {void}
 */
export function saveRecent(list) {
  const sanitized = Array.isArray(list)
    ? list
        .filter((item) => typeof item === "string" && item.trim().length > 0)
        .slice(0, CONFIG.RECENT_LIMIT)
    : [];
  save(`${CONFIG.STORAGE_PREFIX}recent`, sanitized);
}

/**
 * Loads the user's preferred temperature unit from storage ("C" or "F").
 * 
 * @returns {"C"|"F"} Active unit.
 */
export function loadUnit() {
  const unit = load(`${CONFIG.STORAGE_PREFIX}unit`, CONFIG.DEFAULT_UNIT);
  if (unit === "C" || unit === "F") {
    return unit;
  }
  return CONFIG.DEFAULT_UNIT;
}

/**
 * Persists the user's preferred temperature unit to storage.
 * 
 * @param {"C"|"F"} unit - Temperature unit to save.
 * @returns {void}
 */
export function saveUnit(unit) {
  if (unit === "C" || unit === "F") {
    save(`${CONFIG.STORAGE_PREFIX}unit`, unit);
  }
}

/**
 * Loads the last viewed city ID from storage.
 * 
 * @returns {string} Last viewed city ID.
 */
export function loadLastCity() {
  const cityId = load(`${CONFIG.STORAGE_PREFIX}lastCity`, CONFIG.DEFAULT_CITY_ID);
  if (typeof cityId === "string" && cityId.trim().length > 0) {
    return cityId.trim().toLowerCase();
  }
  return CONFIG.DEFAULT_CITY_ID;
}

/**
 * Persists the last viewed city ID to storage.
 * 
 * @param {string} id - City ID string.
 * @returns {void}
 */
export function saveLastCity(id) {
  if (typeof id === "string" && id.trim().length > 0) {
    save(`${CONFIG.STORAGE_PREFIX}lastCity`, id.trim().toLowerCase());
  }
}
