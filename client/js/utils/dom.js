/**
 * @file dom.js
 * @description Safe DOM manipulation utilities with element existence guards.
 */

/**
 * Safely sets the textContent of an element identified by ID.
 * Logs a warning if the element does not exist, preventing runtime errors.
 * 
 * @param {string} id - The ID of the target element.
 * @param {string|number} value - The text content to set.
 * @returns {void}
 */
export function setText(id, value) {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`[SkyLume] Element with id "${id}" not found in DOM.`);
    return;
  }
  element.textContent = String(value);
}

/**
 * Clears all child nodes from a given DOM container.
 * 
 * @param {HTMLElement|null} element - The parent DOM element.
 * @returns {void}
 */
export function clearChildren(element) {
  if (!element) return;
  element.textContent = "";
}

/**
 * Creates an HTML element with optional class names, text content, attributes, and children.
 * Guarantees that untrusted string values are set via textContent rather than innerHTML.
 * 
 * @param {string} tag - HTML tag name (e.g. 'div', 'li', 'span').
 * @param {Object} [options={}] - Configuration options.
 * @param {string} [options.className] - CSS class name or space-separated classes.
 * @param {string} [options.text] - Plain text content.
 * @param {Object<string, string>} [options.attributes] - Key-value map of HTML attributes.
 * @param {Array<Node>} [options.children] - Child nodes to append.
 * @returns {HTMLElement} The created DOM element.
 */
export function createElement(tag, options = {}) {
  const el = document.createElement(tag);

  if (options.className) {
    el.className = options.className;
  }

  if (options.text !== undefined && options.text !== null) {
    el.textContent = String(options.text);
  }

  if (options.attributes) {
    Object.entries(options.attributes).forEach(([attr, val]) => {
      el.setAttribute(attr, val);
    });
  }

  if (Array.isArray(options.children)) {
    options.children.forEach((child) => {
      if (child instanceof Node) {
        el.appendChild(child);
      }
    });
  }

  return el;
}
