/**
 * utils.js — Shared utility functions
 * Pure helpers: no DOM side effects, no global state mutations
 */

'use strict';

/**
 * Throttle a function to fire at most once per `limit` ms.
 * Useful for scroll and resize handlers.
 * @param {Function} fn
 * @param {number} limit - milliseconds
 * @returns {Function}
 */
function throttle(fn, limit = 100) {
  let lastCall = 0;
  return function throttled(...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

/**
 * Debounce a function — delay execution until `wait` ms after last call.
 * Useful for resize, input handlers.
 * @param {Function} fn
 * @param {number} wait - milliseconds
 * @returns {Function}
 */
function debounce(fn, wait = 200) {
  let timer;
  return function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

/**
 * Query a single element, with optional scope.
 * @param {string} selector
 * @param {Element|Document} [scope=document]
 * @returns {Element|null}
 */
function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

/**
 * Query all elements, returns a real Array.
 * @param {string} selector
 * @param {Element|Document} [scope=document]
 * @returns {Element[]}
 */
function qsAll(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

/**
 * Trap focus inside an element (for modal dialogs).
 * Returns a cleanup function.
 * @param {Element} el
 * @returns {Function} cleanup
 */
function trapFocus(el) {
  const focusable = el.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  function handleKeydown(e) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  el.addEventListener('keydown', handleKeydown);
  if (first) first.focus();

  return () => el.removeEventListener('keydown', handleKeydown);
}

/**
 * Check if the user prefers reduced motion.
 * @returns {boolean}
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if a touch device is in use.
 * @returns {boolean}
 */
function isTouchDevice() {
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

/**
 * Add a ripple effect to a button element at click coordinates.
 * @param {MouseEvent} e
 */
function createRipple(e) {
  const btn    = e.currentTarget;
  const circle = document.createElement('span');
  const diam   = Math.max(btn.clientWidth, btn.clientHeight);
  const radius = diam / 2;
  const rect   = btn.getBoundingClientRect();

  circle.style.cssText = `
    width:  ${diam}px;
    height: ${diam}px;
    left:   ${e.clientX - rect.left - radius}px;
    top:    ${e.clientY - rect.top  - radius}px;
  `;
  circle.classList.add('ripple');

  const existing = btn.querySelector('.ripple');
  if (existing) existing.remove();

  btn.appendChild(circle);
}

// Expose to global scope (no module bundler)
window.BlogrUtils = {
  throttle,
  debounce,
  qs,
  qsAll,
  trapFocus,
  prefersReducedMotion,
  isTouchDevice,
  createRipple,
};
