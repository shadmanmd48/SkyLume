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
  STORAGE_PREFIX: "skylume:",

  /** @type {string} CARTO Dark Matter basemap tile layer URL template */
  MAP_TILE_URL: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",

  /** @type {string} Subdomains used by CARTO tile servers */
  MAP_SUBDOMAINS: "abcd",

  /** @type {string} Attribution HTML for OpenStreetMap and CARTO */
  MAP_ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>',

  /** @type {[number, number]} Default center coordinates [latitude, longitude] (Chennai) */
  MAP_DEFAULT_CENTER: [13.08, 80.27],

  /** @type {number} Default initial zoom level */
  MAP_DEFAULT_ZOOM: 4,

  /** @type {number} Minimum zoom level constraint */
  MAP_MIN_ZOOM: 2,

  /** @type {number} Maximum zoom level constraint */
  MAP_MAX_ZOOM: 12
};
