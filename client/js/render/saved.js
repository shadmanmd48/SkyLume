/**
 * @file saved.js
 * @description Renders the quick-access saved city chips row.
 */

import { setText, clearChildren, createElement } from "../utils/dom.js";
import { formatTemp } from "../utils/temperature.js";

/**
 * Renders the saved city chips into #saved-cities-list and updates the topbar badge count.
 * 
 * @param {Array<Object>} savedCities - List of saved city items.
 * @param {"C"|"F"} unit - Active temperature unit.
 * @param {string} activeCityId - Currently active city ID.
 * @returns {void}
 */
export function renderSaved(savedCities, unit, activeCityId) {
  const container = document.getElementById("saved-cities-list");
  if (!container) return;

  const list = Array.isArray(savedCities) ? savedCities : [];
  setText("saved-count", list.length);
  clearChildren(container);

  list.forEach((city) => {
    const isActive = city.id === activeCityId;

    const iconSpan = createElement("span", {
      className: "saved-chip__icon",
      text: city.icon || "⛅",
      attributes: { "aria-hidden": "true" }
    });

    const nameSpan = createElement("span", {
      className: "saved-chip__name",
      text: city.city
    });

    const tempSpan = createElement("span", {
      className: "saved-chip__temp",
      text: `${formatTemp(city.tempC, unit)}°`
    });

    const selectBtn = createElement("button", {
      className: "saved-chip__select-btn",
      attributes: {
        type: "button",
        "aria-label": `Select ${city.city}`
      },
      children: [iconSpan, nameSpan, tempSpan]
    });

    const removeBtn = createElement("button", {
      className: "saved-chip__remove-btn",
      text: "✕",
      attributes: {
        type: "button",
        "aria-label": `Remove ${city.city} from saved`
      }
    });

    const chipLi = createElement("li", {
      className: `saved-chip${isActive ? " saved-chip--active" : ""}`,
      attributes: { "data-id": city.id },
      children: [selectBtn, removeBtn]
    });

    container.appendChild(chipLi);
  });
}
