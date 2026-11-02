/**
 * @file main.js
 * @description Application entry point. Handles event wiring, asynchronous flows, and startup hydration.
 */

import { CONFIG } from "./config.js";
import { state } from "./state.js";
import { mockSaved } from "./data/mock-weather.js";
import { mockCities } from "./data/mock-cities.js";
import { searchCities, getWeather } from "./api/index.js";
import {
  loadSaved,
  saveSaved,
  loadRecent,
  saveRecent,
  loadUnit,
  saveUnit,
  loadLastCity,
  saveLastCity
} from "./services/storage.js";
import { renderCurrentCard } from "./render/currentCard.js";
import { renderHourly } from "./render/hourly.js";
import { renderDaily } from "./render/daily.js";
import { renderSaved } from "./render/saved.js";
import { renderSuggestions, closeSuggestions } from "./render/suggestions.js";
import { debounce } from "./utils/debounce.js";

// ============================================================================
// 1. UI STATE MANAGERS (Loading & Error Overlays)
// ============================================================================

/**
 * Displays the loading overlay.
 * @returns {void}
 */
function showLoading() {
  state.isLoading = true;
  const overlay = document.getElementById("loading");
  if (overlay) overlay.hidden = false;
}

/**
 * Hides the loading overlay.
 * @returns {void}
 */
function hideLoading() {
  state.isLoading = false;
  const overlay = document.getElementById("loading");
  if (overlay) overlay.hidden = true;
}

/**
 * Displays the error overlay with a custom error message.
 * @param {string} message - Error description.
 * @returns {void}
 */
function showError(message) {
  state.error = message;
  const overlay = document.getElementById("error");
  if (overlay) {
    overlay.hidden = false;
    const textEl = overlay.querySelector(".state-overlay__text");
    if (textEl) textEl.textContent = message;
  }
}

/**
 * Clears and hides the error overlay.
 * @returns {void}
 */
function clearError() {
  state.error = null;
  const overlay = document.getElementById("error");
  if (overlay) overlay.hidden = true;
}

// ============================================================================
// 2. FAVORITES & RECENT SEARCHES
// ============================================================================

/**
 * Appends a city ID to recent search history (max CONFIG.RECENT_LIMIT),
 * deduplicating and persisting to storage.
 * 
 * @param {string} cityId - City ID.
 * @returns {void}
 */
function addRecent(cityId) {
  if (!cityId) return;

  state.recentCities = [
    cityId,
    ...state.recentCities.filter((id) => id !== cityId)
  ].slice(0, CONFIG.RECENT_LIMIT);

  saveRecent(state.recentCities);
  saveLastCity(cityId);
}

/**
 * Updates visual active class and aria-pressed on the heart button.
 * @returns {void}
 */
function renderHeart() {
  const heartBtn = document.getElementById("fav-btn");
  if (!heartBtn) return;

  const isSaved = state.savedCities.some((item) => item.id === state.activeCityId);
  heartBtn.classList.toggle("is-active", isSaved);
  heartBtn.setAttribute("aria-pressed", String(isSaved));
}

/**
 * Toggles the current active city in/out of the saved cities list.
 * @returns {void}
 */
function toggleFavourite() {
  if (!state.weather) return;

  const currentId = state.activeCityId;
  const existingIndex = state.savedCities.findIndex((item) => item.id === currentId);

  if (existingIndex !== -1) {
    state.savedCities.splice(existingIndex, 1);
  } else {
    state.savedCities.push({
      id: currentId,
      city: state.weather.city,
      tempC: state.weather.current.tempC,
      icon: state.weather.current.icon
    });
  }

  saveSaved(state.savedCities);
  renderSaved(state.savedCities, state.unit, state.activeCityId);
  renderHeart();
}

// ============================================================================
// 3. ASYNC DATA FETCHING (loadCity)
// ============================================================================

/**
 * Loads city forecast data with race-condition guards and loading/error states.
 * 
 * @param {string} cityId - ID of city to fetch.
 * @returns {Promise<void>}
 */
async function loadCity(cityId) {
  state.requestCounter += 1;
  const currentRequestId = state.requestCounter;

  state.lastCityId = cityId;
  clearError();
  showLoading();

  try {
    const weatherData = await getWeather(cityId);

    // Discard stale out-of-order response
    if (currentRequestId !== state.requestCounter) {
      return;
    }

    state.weather = weatherData;
    state.activeCityId = cityId;
    state.activeHourIndex = 0;
    state.activeDayIndex = 0;

    // Refresh saved chip temperature and icon if saved
    const savedIndex = state.savedCities.findIndex((item) => item.id === cityId);
    if (savedIndex !== -1) {
      state.savedCities[savedIndex].tempC = weatherData.current.tempC;
      state.savedCities[savedIndex].icon = weatherData.current.icon;
      saveSaved(state.savedCities);
    }

    addRecent(cityId);
    renderAll();
  } catch (err) {
    if (currentRequestId !== state.requestCounter) {
      return;
    }
    showError(err.message || "Failed to load weather data.");
  } finally {
    if (currentRequestId === state.requestCounter) {
      hideLoading();
    }
  }
}

// ============================================================================
// 4. COORDINATED RENDER PIPELINE
// ============================================================================

/**
 * Re-renders all weather-dependent UI components from state.
 * @returns {void}
 */
function renderAll() {
  renderCurrentCard(state.weather, state.unit);
  renderHourly(state.weather, state.unit, state.activeHourIndex);
  renderDaily(state.weather, state.unit, state.activeDayIndex);
  renderSaved(state.savedCities, state.unit, state.activeCityId);
  renderHeart();
}

/**
 * Toggles the temperature unit between "C" and "F" and persists the choice.
 * 
 * @param {"C"|"F"} newUnit - Target temperature unit.
 * @returns {void}
 */
function setUnit(newUnit) {
  if (state.unit === newUnit) return;

  state.unit = newUnit;
  saveUnit(newUnit);

  const btnCelsius = document.getElementById("unit-celsius");
  const btnFahrenheit = document.getElementById("unit-fahrenheit");

  if (btnCelsius) {
    const isC = newUnit === "C";
    btnCelsius.classList.toggle("topbar__unit-btn--active", isC);
    btnCelsius.setAttribute("aria-pressed", String(isC));
  }

  if (btnFahrenheit) {
    const isF = newUnit === "F";
    btnFahrenheit.classList.toggle("topbar__unit-btn--active", isF);
    btnFahrenheit.setAttribute("aria-pressed", String(isF));
  }

  renderAll();
}

/**
 * Resolves recent city IDs into city objects and renders the dropdown list.
 * @returns {void}
 */
function showRecentSearches() {
  if (state.recentCities.length === 0) {
    closeSuggestions();
    return;
  }

  state.isShowingRecents = true;
  state.highlightedIndex = -1;
  state.suggestions = state.recentCities.map((id) => {
    const found = mockCities.find((c) => c.id === id);
    if (found) {
      return { id: found.id, city: found.city, country: found.country };
    }
    return { id, city: id.charAt(0).toUpperCase() + id.slice(1), country: "" };
  });

  renderSuggestions({
    suggestions: state.suggestions,
    isRecents: true,
    highlightedIndex: state.highlightedIndex,
    query: ""
  });
}

/**
 * Debounced search handler for user typing.
 * @returns {Promise<void>}
 */
async function handleSearchInput() {
  const searchInput = document.getElementById("city-search");
  if (!searchInput) return;

  const query = searchInput.value.trim();

  if (!query) {
    if (state.recentCities.length > 0) {
      showRecentSearches();
    } else {
      closeSuggestions();
    }
    return;
  }

  state.isShowingRecents = false;
  state.searchCounter += 1;
  const currentSearchId = state.searchCounter;

  const results = await searchCities(query);

  if (currentSearchId !== state.searchCounter) {
    return;
  }

  state.suggestions = results;
  state.highlightedIndex = -1;
  renderSuggestions({
    suggestions: state.suggestions,
    isRecents: false,
    highlightedIndex: state.highlightedIndex,
    query
  });
}

// ============================================================================
// 5. EVENT WIRING & INITIALIZATION
// ============================================================================

/**
 * Initializes state from storage, binds all event listeners, and mounts the application.
 * @returns {void}
 */
function init() {
  // 1. Restore Persisted Unit
  const storedUnit = loadUnit();
  state.unit = storedUnit;

  const btnCelsius = document.getElementById("unit-celsius");
  const btnFahrenheit = document.getElementById("unit-fahrenheit");

  if (btnCelsius) {
    btnCelsius.classList.toggle("topbar__unit-btn--active", storedUnit === "C");
    btnCelsius.setAttribute("aria-pressed", String(storedUnit === "C"));
  }

  if (btnFahrenheit) {
    btnFahrenheit.classList.toggle("topbar__unit-btn--active", storedUnit === "F");
    btnFahrenheit.setAttribute("aria-pressed", String(storedUnit === "F"));
  }

  // 2. Restore Saved Cities (first visit falls back to mockSaved)
  const storedSaved = loadSaved();
  state.savedCities = storedSaved !== null ? storedSaved : [...mockSaved];

  // 3. Restore Recent Searches
  state.recentCities = loadRecent();

  // 4. Unit Toggle Buttons Listener
  const unitButtons = document.querySelectorAll(".topbar__unit-btn");
  unitButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedUnit = button.dataset.unit || (button.id === "unit-celsius" ? "C" : "F");
      setUnit(selectedUnit);
    });
  });

  // 5. Weather Card Favorite/Heart Button Listener
  const heartBtn = document.getElementById("fav-btn");
  if (heartBtn) {
    heartBtn.addEventListener("click", toggleFavourite);
  }

  // 6. Search Input Listener (Debounced search, Focus for recents, Keyboard navigation)
  const searchInput = document.getElementById("city-search");
  if (searchInput) {
    const debouncedSearch = debounce(handleSearchInput, CONFIG.DEBOUNCE_MS);
    searchInput.addEventListener("input", debouncedSearch);

    searchInput.addEventListener("focus", () => {
      if (!searchInput.value.trim() && state.recentCities.length > 0) {
        showRecentSearches();
      }
    });

    searchInput.addEventListener("keydown", (event) => {
      const count = state.suggestions.length;

      if (event.key === "ArrowDown") {
        if (count > 0) {
          event.preventDefault();
          state.highlightedIndex = (state.highlightedIndex + 1) % count;
          searchInput.setAttribute("aria-activedescendant", `suggestion-opt-${state.highlightedIndex}`);
          renderSuggestions({
            suggestions: state.suggestions,
            isRecents: state.isShowingRecents,
            highlightedIndex: state.highlightedIndex,
            query: searchInput.value.trim()
          });
        }
      } else if (event.key === "ArrowUp") {
        if (count > 0) {
          event.preventDefault();
          state.highlightedIndex = (state.highlightedIndex - 1 + count) % count;
          searchInput.setAttribute("aria-activedescendant", `suggestion-opt-${state.highlightedIndex}`);
          renderSuggestions({
            suggestions: state.suggestions,
            isRecents: state.isShowingRecents,
            highlightedIndex: state.highlightedIndex,
            query: searchInput.value.trim()
          });
        }
      } else if (event.key === "Enter") {
        event.preventDefault();

        if (count > 0) {
          const pickIndex = state.highlightedIndex >= 0 ? state.highlightedIndex : 0;
          const chosen = state.suggestions[pickIndex];
          if (chosen) {
            loadCity(chosen.id);
            closeSuggestions();
            searchInput.value = "";
          }
        } else if (searchInput.value.trim()) {
          showError("City not found. Try another search.");
          closeSuggestions();
        }
      } else if (event.key === "Escape") {
        closeSuggestions();
      }
    });
  }

  // 7. Search Suggestions Delegation (Click on item OR "Clear" action)
  const suggestionsList = document.getElementById("search-suggestions");
  if (suggestionsList) {
    suggestionsList.addEventListener("click", (event) => {
      const clearBtn = event.target.closest('[data-action="clear-recent"]');
      if (clearBtn) {
        state.recentCities = [];
        saveRecent([]);
        closeSuggestions();
        return;
      }

      const item = event.target.closest("li[data-id]");
      if (!item) return;

      const cityId = item.dataset.id;
      loadCity(cityId);
      closeSuggestions();

      if (searchInput) {
        searchInput.value = "";
      }
    });
  }

  // 8. Outside Click Listener to Close Suggestions
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".search-bar") && !event.target.closest(".search-wrap")) {
      closeSuggestions();
    }
  });

  // 9. Retry Button Listener
  const retryBtn = document.getElementById("retry-btn");
  if (retryBtn) {
    retryBtn.addEventListener("click", () => {
      loadCity(state.lastCityId);
    });
  }

  // 10. Hourly Forecast Delegation
  const hourlyList = document.getElementById("hourly-forecast-list");
  if (hourlyList) {
    hourlyList.addEventListener("click", (event) => {
      const tile = event.target.closest(".hourly-tile");
      if (!tile) return;

      const index = Number(tile.dataset.index);
      if (!isNaN(index) && state.activeHourIndex !== index) {
        state.activeHourIndex = index;
        renderHourly(state.weather, state.unit, state.activeHourIndex);
      }
    });
  }

  // 11. Daily Forecast Delegation
  const dailyList = document.getElementById("daily-forecast-list");
  if (dailyList) {
    dailyList.addEventListener("click", (event) => {
      const card = event.target.closest(".daily-card");
      if (!card) return;

      const index = Number(card.dataset.index);
      if (!isNaN(index) && state.activeDayIndex !== index) {
        state.activeDayIndex = index;
        renderDaily(state.weather, state.unit, state.activeDayIndex);
      }
    });
  }

  // 12. Saved Cities Row Delegation (Removal vs Selection)
  const savedList = document.getElementById("saved-cities-list");
  if (savedList) {
    savedList.addEventListener("click", (event) => {
      const removeBtn = event.target.closest(".saved-chip__remove-btn");
      if (removeBtn) {
        const chip = removeBtn.closest(".saved-chip");
        if (!chip) return;

        const cityId = chip.dataset.id;
        state.savedCities = state.savedCities.filter((city) => city.id !== cityId);
        saveSaved(state.savedCities);

        renderSaved(state.savedCities, state.unit, state.activeCityId);
        renderHeart();
        return;
      }

      const chip = event.target.closest(".saved-chip");
      if (chip) {
        const cityId = chip.dataset.id;
        loadCity(cityId);
      }
    });
  }

  // 13. Mount initial city (restores last viewed city, or default)
  const initialCity = loadLastCity();
  loadCity(initialCity);
}

// Start application once DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
