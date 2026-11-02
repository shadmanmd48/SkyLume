/**
 * @file suggestions.js
 * @description Renders autocomplete search suggestions and recent search history with full accessibility.
 */

import { clearChildren, createElement } from "../utils/dom.js";

/**
 * Renders suggestions or recent searches into #search-suggestions.
 * 
 * @param {Object} params - Rendering options.
 * @param {Array<Object>} params.suggestions - List of city items.
 * @param {boolean} [params.isRecents=false] - Whether showing recent history.
 * @param {number} [params.highlightedIndex=-1] - Currently keyboard-highlighted item index.
 * @param {string} [params.query=""] - Current query string.
 * @returns {void}
 */
export function renderSuggestions({ suggestions, isRecents = false, highlightedIndex = -1, query = "" }) {
  const container = document.getElementById("search-suggestions");
  if (!container) return;

  clearChildren(container);

  // Case 1: Empty input and showing recents
  if (!query && isRecents) {
    if (!suggestions || suggestions.length === 0) {
      container.hidden = true;
      return;
    }

    container.hidden = false;

    // Header row
    const titleSpan = createElement("span", {
      className: "search-bar__section-title",
      text: "Recent searches"
    });

    const clearBtn = createElement("button", {
      className: "search-bar__clear-btn",
      text: "Clear",
      attributes: {
        type: "button",
        "data-action": "clear-recent",
        "aria-label": "Clear recent searches"
      }
    });

    const headerLi = createElement("li", {
      className: "search-bar__section-header",
      children: [titleSpan, clearBtn]
    });

    container.appendChild(headerLi);

    // Recent items
    suggestions.forEach((city, index) => {
      const optId = `suggestion-opt-${index}`;
      const li = createElement("li", {
        className: isHighlighted ? "is-highlighted" : "",
        attributes: {
          id: optId,
          role: "option",
          "aria-selected": String(isHighlighted),
          "data-id": city.id
        },
        children: [boldCity, comma, countrySpan]
      });

      if (isHighlighted) {
        requestAnimationFrame(() => {
          li.scrollIntoView({ block: "nearest" });
        });
      }

      container.appendChild(li);
    });

    return;
  }

  // Case 2: Empty input without recents
  if (!query) {
    container.hidden = true;
    return;
  }

  // Case 3: Non-empty query with no matches
  if (!suggestions || suggestions.length === 0) {
    container.hidden = false;
    const noMatchLi = createElement("li", {
      className: "search-bar__no-match",
      text: "No matches found",
      attributes: { role: "status" }
    });
    container.appendChild(noMatchLi);
    return;
  }

  // Case 4: Autocomplete search results
  container.hidden = false;
  suggestions.forEach((city, index) => {
    const isHighlighted = index === highlightedIndex;
    const optId = `suggestion-opt-${index}`;

    const boldCity = createElement("strong", { text: city.city });
    const comma = document.createTextNode(", ");
    const countrySpan = createElement("span", {
      text: city.country,
      attributes: { style: "color: var(--text-dim);" }
    });

    const li = createElement("li", {
      className: isHighlighted ? "is-highlighted" : "",
      attributes: {
        id: optId,
        role: "option",
        "aria-selected": String(isHighlighted),
        "data-id": city.id
      },
      children: [boldCity, comma, countrySpan]
    });

    if (isHighlighted) {
      requestAnimationFrame(() => {
        li.scrollIntoView({ block: "nearest" });
      });
    }

    container.appendChild(li);
  });
}

/**
 * Closes and clears the search suggestions dropdown list.
 * 
 * @returns {void}
 */
export function closeSuggestions() {
  const container = document.getElementById("search-suggestions");
  if (container) {
    clearChildren(container);
    container.hidden = true;
  }
  const searchInput = document.getElementById("city-search");
  if (searchInput) {
    searchInput.removeAttribute("aria-activedescendant");
  }
}
