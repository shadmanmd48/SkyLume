/**
 * @file mockApi.js
 * @description Simulated weather API client implementing Promises and configurable network latency.
 */

import { mockCities } from "../data/mock-cities.js";
import { mockWeather } from "../data/mock-weather.js";
import { CONFIG } from "../config.js";

/**
 * Returns a Promise that resolves after a specified duration in milliseconds.
 * 
 * @param {number} ms - Milliseconds to delay.
 * @returns {Promise<void>}
 */
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Searches the mock cities database by city name or country.
 * 
 * @param {string} query - The search query typed by the user.
 * @returns {Promise<Array<Object>>} Matching city objects up to CONFIG.MAX_SUGGESTIONS.
 */
export async function searchCities(query) {
  await delay(CONFIG.MOCK_SEARCH_DELAY_MS);

  if (!query || !query.trim()) {
    return [];
  }

  const normalizedQuery = query.trim().toLowerCase();

  const matches = mockCities.filter((item) => {
    const cityNameMatches = item.city.toLowerCase().includes(normalizedQuery);
    const countryMatches = item.country.toLowerCase().includes(normalizedQuery);
    return cityNameMatches || countryMatches;
  });

  return matches.slice(0, CONFIG.MAX_SUGGESTIONS);
}

/**
 * Fetches full forecast weather details for a given city ID.
 * 
 * @param {string} cityId - Unique city identifier (e.g. "chennai", "paris").
 * @returns {Promise<Object>} Full forecast object matching mockWeather schema.
 * @throws {Error} If city is not found or if testing network errors.
 */
export async function getWeather(cityId) {
  await delay(CONFIG.MOCK_WEATHER_DELAY_MS);

  // Hook for testing error boundaries and retry flow
  if (cityId === "test-error") {
    throw new Error("Network error. Unable to connect to weather server.");
  }

  const city = mockCities.find((c) => c.id.toLowerCase() === cityId.toLowerCase());

  if (!city) {
    throw new Error("City not found. Try another search.");
  }

  const tempDelta = city.tempC - mockWeather.current.tempC;

  const shiftedHourly = mockWeather.hourly.map((hour) => ({
    time: hour.time,
    tempC: hour.tempC + tempDelta,
    rain: Math.max(0, Math.min(100, hour.rain + (city.rainChance - mockWeather.current.rainChance))),
    icon: city.icon
  }));

  const shiftedDaily = mockWeather.daily.map((day) => ({
    day: day.day,
    date: day.date,
    highC: day.highC + tempDelta,
    lowC: day.lowC + tempDelta,
    condition: city.condition,
    rain: city.rainChance,
    icon: city.icon
  }));

  return {
    city: city.city,
    country: city.country,
    region: city.region,
    localTime: city.isNight ? "11:22 PM" : "02:45 PM",
    isNight: city.isNight,
    current: {
      tempC: city.tempC,
      feelsLikeC: city.feelsLikeC,
      highC: city.highC,
      lowC: city.lowC,
      condition: city.condition,
      icon: city.icon,
      humidity: city.humidity,
      windKmh: city.windKmh,
      windDir: "E",
      rainChance: city.rainChance,
      visibilityKm: 10,
      uv: city.isNight ? 0 : 7,
      uvLabel: city.isNight ? "Low" : "High",
      sunrise: "5:54 AM",
      sunset: "6:12 PM"
    },
    hourly: shiftedHourly,
    daily: shiftedDaily
  };
}
