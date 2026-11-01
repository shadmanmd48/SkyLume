/**
 * @file httpApi.js
 * @description Production HTTP API client stub for live backend integration (Step 8).
 */

/*
Example production implementation using fetch and AbortController:

import { CONFIG } from "../config.js";

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}
*/

/**
 * Searches cities via live backend endpoint.
 * 
 * @param {string} query - The search query string.
 * @returns {Promise<Array<Object>>}
 * @throws {Error} Throws not implemented error until Step 8 backend is attached.
 */
export async function searchCities(query) {
  void query;
  throw new Error("HTTP API searchCities is not implemented yet. Enable CONFIG.USE_MOCK.");
}

/**
 * Fetches weather for a city ID via live backend endpoint.
 * 
 * @param {string} cityId - City ID.
 * @returns {Promise<Object>}
 * @throws {Error} Throws not implemented error until Step 8 backend is attached.
 */
export async function getWeather(cityId) {
  void cityId;
  throw new Error("HTTP API getWeather is not implemented yet. Enable CONFIG.USE_MOCK.");
}
