/**
 * @file daily.js
 * @description Renders the 5-day daily forecast cards.
 */

import { clearChildren, createElement } from "../utils/dom.js";
import { formatTemp } from "../utils/temperature.js";

/**
 * Renders the 5-day daily forecast cards into #daily-forecast-list.
 * 
 * @param {Object|null} weather - Active weather data.
 * @param {"C"|"F"} unit - Active temperature unit.
 * @param {number} activeIndex - Currently highlighted card index.
 * @returns {void}
 */
export function renderDaily(weather, unit, activeIndex = 0) {
  if (!weather || !Array.isArray(weather.daily)) return;

  const container = document.getElementById("daily-forecast-list");
  if (!container) return;

  clearChildren(container);

  weather.daily.forEach((item, index) => {
    const isActive = index === activeIndex;

    const dayHeading = createElement("h4", {
      className: "daily-card__day",
      text: item.day
    });

    const dateSpan = createElement("span", {
      className: "daily-card__date",
      text: item.date
    });

    const dayDateWrapper = createElement("div", {
      className: "daily-card__day-date",
      children: [dayHeading, dateSpan]
    });

    const iconSpan = createElement("span", {
      className: "daily-card__icon",
      text: item.icon,
      attributes: { "aria-hidden": "true" }
    });

    const tempPara = createElement("p", {
      className: "daily-card__temp",
      text: `${formatTemp(item.highC, unit)}° / ${formatTemp(item.lowC, unit)}°`
    });

    const condPara = createElement("p", {
      className: "daily-card__condition",
      text: item.condition
    });

    const rainDrop = createElement("span", {
      text: "💧",
      attributes: { "aria-hidden": "true" }
    });

    const rainText = document.createTextNode(` ${item.rain}% rain`);

    const rainPara = createElement("p", {
      className: "daily-card__rain",
      children: [rainDrop, rainText]
    });

    const card = createElement("article", {
      className: `daily-card${isActive ? " daily-card--active" : ""}`,
      attributes: { "data-index": String(index) },
      children: [dayDateWrapper, iconSpan, tempPara, condPara, rainPara]
    });

    const itemLi = createElement("li", {
      className: "daily__item",
      children: [card]
    });

    container.appendChild(itemLi);
  });
}
