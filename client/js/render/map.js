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
