/**
 * @file config.js
 * @description Central application configuration and constants.
 */

export const CONFIG = {
  /** @type {boolean} Flag to determine if mock API or real HTTP API is used */
  USE_MOCK: true,

  /** @type {string} Base URL for backend HTTP API endpoints */
  API_BASE_URL: "/api",

  /** @type {number} Delay in milliseconds for search input debounce */
  DEBOUNCE_MS: 300,

  /** @type {number} Maximum number of recent cities saved in search history */
  RECENT_LIMIT: 5,

  /** @type {number} Request timeout in milliseconds for network requests */
  REQUEST_TIMEOUT_MS: 8000,

  /** @type {number} Simulated latency in milliseconds for mock city search */
  MOCK_SEARCH_DELAY_MS: 250,

  /** @type {number} Simulated latency in milliseconds for mock weather fetch */
  MOCK_WEATHER_DELAY_MS: 700,

  /** @type {number} Maximum search autocomplete suggestion results to show */
  MAX_SUGGESTIONS: 6,

  /** @type {string} Default city ID to load on cold start */
  DEFAULT_CITY_ID: "chennai",

  /** @type {"C"|"F"} Default temperature unit */
  DEFAULT_UNIT: "C",

  /** @type {string} Key prefix for localStorage namespace isolation */
  STORAGE_PREFIX: "skylume:"
};
