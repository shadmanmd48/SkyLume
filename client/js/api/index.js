/**
 * @file index.js
 * @description API router module. Dynamically delegates requests to mockApi or httpApi based on CONFIG.
 */

import { CONFIG } from "../config.js";
import * as mockApi from "./mockApi.js";
import * as httpApi from "./httpApi.js";

/**
 * Searches cities using either mock or live backend according to CONFIG.USE_MOCK.
 * 
 * @param {string} query - City search query.
 * @returns {Promise<Array<Object>>}
 */
export async function searchCities(query) {
  if (CONFIG.USE_MOCK) {
    return mockApi.searchCities(query);
  }
  return httpApi.searchCities(query);
}

/**
 * Fetches full weather details using either mock or live backend according to CONFIG.USE_MOCK.
 * 
 * @param {string} cityId - City ID.
 * @returns {Promise<Object>}
 */
export async function getWeather(cityId) {
  if (CONFIG.USE_MOCK) {
    return mockApi.getWeather(cityId);
  }
  return httpApi.getWeather(cityId);
}
