/**
 * main.js — Application entry point
 *
 * Bootstraps all modules in the correct order.
 * Keeps this file thin — orchestration only, no logic here.
 */

'use strict';

(function init() {
  // Guard: ensure our utilities are loaded
  if (typeof BlogrUtils === 'undefined') {
    console.error('[Blogr] BlogrUtils not loaded. Check script order in index.html.');
    return;
  }

  /* ------------------------------------------------------------------ */
  /*  Boot sequence                                                       */
  /* ------------------------------------------------------------------ */

  // 1. Page loader — initialise immediately so it starts counting
  if (typeof BlogrLoader !== 'undefined') {
    BlogrLoader.init();
  }

  // 2. Navigation — needs DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof BlogrNavigation !== 'undefined') {
      BlogrNavigation.init();
    }

    if (typeof BlogrAnimations !== 'undefined') {
      BlogrAnimations.init();
    }

    // Log build info in dev (stripped in prod via minification)
    console.info('[Blogr] App initialised ✓');
  });

  /* ------------------------------------------------------------------ */
  /*  Global keyboard shortcut — "/" focuses first nav item              */
  /* ------------------------------------------------------------------ */
  document.addEventListener('keydown', (e) => {
    // Skip if typing in an input
    if (e.target.matches('input, textarea, select')) return;

    if (e.key === 'Escape') {
      BlogrNavigation.closeAllDropdowns();
      BlogrNavigation.closeMobileMenu();
    }
  });

  /* ------------------------------------------------------------------ */
  /*  Smooth-scroll any hash links                                       */
  /* ------------------------------------------------------------------ */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href').slice(1);
    const target   = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    target.focus({ preventScroll: true });
  });

})();
