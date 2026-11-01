/**
 * @file currentCard.js
 * @description Renders the current weather conditions card.
 */

import { setText } from "../utils/dom.js";
import { formatTemp } from "../utils/temperature.js";

/**
 * Renders the hero weather card with the current conditions.
 * 
 * @param {Object|null} weather - The weather data object.
 * @param {"C"|"F"} unit - Active temperature unit.
 * @returns {void}
 */
export function renderCurrentCard(weather, unit) {
  if (!weather || !weather.current) return;

  const { current } = weather;

  // City, Region, and Local Time
  setText("city-name", `${weather.city}, ${weather.country}`);
  setText("region-name", weather.region);
  setText("local-time", `${weather.localTime} local`);

  // Scene badge
  setText("scene-badge", weather.isNight ? "Night" : "Day");

  // Temperature and conditions
  setText("current-weather-icon", current.icon);
  setText("current-temp", formatTemp(current.tempC, unit));
  setText("current-temp-unit", `°${unit}`);
  setText("condition-text", current.condition);
  setText("feels-like-temp", `${formatTemp(current.feelsLikeC, unit)}°${unit}`);
  setText("temp-high", `${formatTemp(current.highC, unit)}°`);
  setText("temp-low", `${formatTemp(current.lowC, unit)}°`);

  // 8 Weather stat tiles
  setText("stat-humidity", `${current.humidity}%`);
  setText("stat-wind", `${current.windKmh} km/h`);
  setText("stat-rain-chance", `${current.rainChance}%`);
  setText("stat-visibility", `${current.visibilityKm} km`);
  setText("stat-uv-index", `${current.uv} · ${current.uvLabel}`);
  setText("stat-wind-dir", current.windDir);
  setText("stat-sunrise", current.sunrise);
  setText("stat-sunset", current.sunset);
}
