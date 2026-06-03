/**
 * loader.js — Page loading state management
 * Controls the splash screen shown while assets load
 */

'use strict';

const BlogrLoader = (() => {
  /** @type {HTMLElement|null} */
  let loaderEl = null;

  /** Minimum time (ms) the loader stays visible — prevents flash */
  const MIN_DISPLAY_TIME = 900;

  /** Timestamp when the loader was first shown */
  let startTime = Date.now();

  /**
   * Hide the loader gracefully after minimum display time.
   */
  function hide() {
    const elapsed  = Date.now() - startTime;
    const remaining = Math.max(0, MIN_DISPLAY_TIME - elapsed);

    setTimeout(() => {
      if (!loaderEl) return;

      loaderEl.classList.add('is-hidden');

      // Remove from DOM after transition completes (500ms in CSS)
      loaderEl.addEventListener(
        'transitionend',
        () => {
          loaderEl.remove();
          loaderEl = null;
          // Dispatch custom event so other modules can react
          document.dispatchEvent(new CustomEvent('blogr:loaded'));
        },
        { once: true }
      );
    }, remaining);
  }

  /**
   * Initialise — grab element reference and set up listeners.
   */
  function init() {
    loaderEl   = document.getElementById('pageLoader');
    startTime  = Date.now();

    if (!loaderEl) return;

    // Hide when DOM + resources are ready
    if (document.readyState === 'complete') {
      hide();
    } else {
      window.addEventListener('load', hide, { once: true });

      // Safety fallback — hide after 4 s regardless
      setTimeout(hide, 4000);
    }
  }

  return { init };
})();

window.BlogrLoader = BlogrLoader;
