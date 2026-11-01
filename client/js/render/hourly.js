/**
 * @file hourly.js
 * @description Renders the horizontally scrollable 12-hour forecast strip.
 */

import { setText, clearChildren, createElement } from "../utils/dom.js";
import { formatTemp } from "../utils/temperature.js";

/**
 * Renders the hourly forecast tiles into #hourly-forecast-list.
 * 
 * @param {Object|null} weather - Active weather data.
 * @param {"C"|"F"} unit - Active temperature unit.
 * @param {number} activeIndex - Currently highlighted tile index.
 * @returns {void}
 */
export function renderHourly(weather, unit, activeIndex = 0) {
  if (!weather || !Array.isArray(weather.hourly)) return;

  const container = document.getElementById("hourly-forecast-list");
  if (!container) return;

  setText("hourly-sublabel", `${weather.city}, 11 PM local`);
  clearChildren(container);

  weather.hourly.forEach((item, index) => {
    const isActive = index === activeIndex;

    const timeSpan = createElement("span", {
      className: "hourly-tile__time",
      text: item.time
    });

    const iconSpan = createElement("span", {
      className: "hourly-tile__icon",
      text: item.icon,
      attributes: { "aria-hidden": "true" }
    });

    const tempSpan = createElement("span", {
      className: "hourly-tile__temp",
      text: `${formatTemp(item.tempC, unit)}°`
    });

    const rainSpan = createElement("span", {
      className: "hourly-tile__rain",
      text: `💧 ${item.rain}%`
    });

    const tile = createElement("li", {
      className: `hourly-tile${isActive ? " hourly-tile--active" : ""}`,
      attributes: { "data-index": String(index) },
      children: [timeSpan, iconSpan, tempSpan, rainSpan]
    });

    container.appendChild(tile);
  });
}
