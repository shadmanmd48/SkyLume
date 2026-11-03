/**
 * @file map.js
 * @description Leaflet map initialization, basemap rendering, and viewport controls.
 * This is the ONLY file in SkyLume authorized to interact with the global Leaflet (L) instance.
 */

import { CONFIG } from "../config.js";

/**
 * Module-level storage for the active Leaflet map instance.
 * @type {L.Map|null}
 */
let mapInstance = null;

/**
 * Initializes the Leaflet world map with safe guards.
 *
 * @param {string} containerId - The DOM element ID where the map should be mounted.
 * @returns {void}
 */
export function initMap(containerId) {
  const container = document.getElementById(containerId);

  // Guard: Verify that Leaflet is loaded on window and the container exists
  if (typeof window.L === "undefined" || !container) {
    if (container) {
      container.textContent = "Map could not load. Check your connection.";
    }
    console.warn("Leaflet library (window.L) or map container is unavailable.");
    return;
  }

  // Prevent multiple initializations on the same container
  if (mapInstance) {
    return;
  }

  // Create the Leaflet map with custom navigation controls disabled
  mapInstance = window.L.map(container, {
    center: CONFIG.MAP_DEFAULT_CENTER,
    zoom: CONFIG.MAP_DEFAULT_ZOOM,
    minZoom: CONFIG.MAP_MIN_ZOOM,
    maxZoom: CONFIG.MAP_MAX_ZOOM,
    zoomControl: false
  });

  // Attach dark CARTO tile layer with proper attribution
  window.L.tileLayer(CONFIG.MAP_TILE_URL, {
    subdomains: CONFIG.MAP_SUBDOMAINS,
    attribution: CONFIG.MAP_ATTRIBUTION,
    minZoom: CONFIG.MAP_MIN_ZOOM,
    maxZoom: CONFIG.MAP_MAX_ZOOM
  }).addTo(mapInstance);
}

/**
 * Zooms in the map by one level.
 * Safely does nothing if the map has not been initialized.
 *
 * @returns {void}
 */
export function zoomIn() {
  if (mapInstance) {
    mapInstance.zoomIn();
  }
}

/**
 * Zooms out the map by one level.
 * Safely does nothing if the map has not been initialized.
 *
 * @returns {void}
 */
export function zoomOut() {
  if (mapInstance) {
    mapInstance.zoomOut();
  }
}

/**
 * Recenters the map to the default coordinates and zoom level defined in CONFIG.
 * Safely does nothing if the map has not been initialized.
 *
 * @returns {void}
 */
export function recenter() {
  if (mapInstance) {
    mapInstance.setView(CONFIG.MAP_DEFAULT_CENTER, CONFIG.MAP_DEFAULT_ZOOM);
  }
}

/**
 * Tells Leaflet to recalculate the map container's size.
 * Useful after container dimension changes or window resizes so tiles don't get misaligned.
 *
 * @returns {void}
 */
export function invalidateSize() {
  if (mapInstance) {
    mapInstance.invalidateSize();
  }
}
