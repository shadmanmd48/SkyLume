/**
 * @file state.js
 * @description Application state store acting as the single source of truth.
 */

import { CONFIG } from "./config.js";

/**
 * @typedef {Object} AppState
 * @property {"C"|"F"} unit - Active temperature unit.
 * @property {Object|null} weather - Current city weather data.
 * @property {Array<Object>} savedCities - Array of saved city items.
 * @property {string[]} recentCities - Array of up to RECENT_LIMIT recent city IDs.
 * @property {string} activeCityId - Currently selected city ID.
 * @property {string} lastCityId - Last requested city ID (for retry handler).
 * @property {number} activeHourIndex - Index of currently highlighted hourly tile.
 * @property {number} activeDayIndex - Index of currently highlighted daily card.
 * @property {boolean} isLoading - Loading state indicator.
 * @property {string|null} error - Current error message or null.
 * @property {Array<Object>} suggestions - Autocomplete or recent suggestions.
 * @property {boolean} isShowingRecents - Whether suggestions dropdown shows recents.
 * @property {number} highlightedIndex - Index of keyboard-highlighted suggestion.
 * @property {number} requestCounter - Monotonic counter for discarding stale weather responses.
 * @property {number} searchCounter - Monotonic counter for discarding stale search responses.
 */

/** @type {AppState} */
export const state = {
  unit: CONFIG.DEFAULT_UNIT,
  weather: null,
  savedCities: [],
  recentCities: [],
  activeCityId: CONFIG.DEFAULT_CITY_ID,
  lastCityId: CONFIG.DEFAULT_CITY_ID,
  activeHourIndex: 0,
  activeDayIndex: 0,
  isLoading: false,
  error: null,
  suggestions: [],
  isShowingRecents: false,
  highlightedIndex: -1,
  requestCounter: 0,
  searchCounter: 0
};
