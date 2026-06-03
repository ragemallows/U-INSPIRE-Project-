/**
 * animations.js — Scroll-triggered reveals, orbit pause optimisation,
 *                 button ripple effects
 *
 * Uses IntersectionObserver for performance — no scroll event listeners.
 */

'use strict';

const BlogrAnimations = (() => {

  /* ------------------------------------------------------------------ */
  /*  SCROLL REVEAL                                                       */
  /* ------------------------------------------------------------------ */

  /**
   * Observe all [.reveal] elements and add .is-visible when they enter
   * the viewport. Unobserves once revealed (fire-once behaviour).
   */
  function initScrollReveal() {
    if (BlogrUtils.prefersReducedMotion()) {
      // Immediately show all reveals — skip the observer
      BlogrUtils.qsAll('.reveal, .reveal-stagger').forEach((el) => {
        el.classList.add('is-visible');
      });
      return;
    }

    const options = {
      root:       null,          // viewport
      rootMargin: '0px 0px -80px 0px', // trigger 80px before bottom edge
      threshold:  0.12,          // 12% of element visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el    = entry.target;
        const delay = el.dataset.revealDelay ? parseFloat(el.dataset.revealDelay) : 0;

        if (delay > 0) {
          setTimeout(() => el.classList.add('is-visible'), delay * 1000);
        } else {
          el.classList.add('is-visible');
        }

        // Unobserve — no need to watch it again
        observer.unobserve(el);
      });
    }, options);

    BlogrUtils.qsAll('.reveal, .reveal-stagger').forEach((el) => {
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------------ */
  /*  ORBIT PAUSE (performance — pause CSS animation when off-screen)    */
  /* ------------------------------------------------------------------ */

  function initOrbitPause() {
    const orbit = document.querySelector('.orbit');
    if (!orbit || BlogrUtils.prefersReducedMotion()) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        orbit.dataset.paused = entry.isIntersecting ? 'false' : 'true';
      },
      { threshold: 0 }
    );

    observer.observe(orbit);
  }

  /* ------------------------------------------------------------------ */
  /*  BUTTON RIPPLE                                                       */
  /* ------------------------------------------------------------------ */

  function initRipple() {
    if (BlogrUtils.prefersReducedMotion()) return;

    BlogrUtils.qsAll('.btn').forEach((btn) => {
      btn.addEventListener('click', BlogrUtils.createRipple);
    });
  }

  /* ------------------------------------------------------------------ */
  /*  HEADER SCROLL BEHAVIOUR (subtle shadow on scroll)                  */
  /* ------------------------------------------------------------------ */

  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    // IntersectionObserver watches a sentinel at top of hero
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:120px;left:0;width:1px;height:1px;';
    document.querySelector('.hero')?.prepend(sentinel);

    const observer = new IntersectionObserver(
      ([entry]) => {
        header.classList.toggle('is-scrolled', !entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (sentinel.parentElement) observer.observe(sentinel);
  }

  /* ------------------------------------------------------------------ */
  /*  PHONE MOCKUP — stagger reveal on mobile                            */
  /* ------------------------------------------------------------------ */

  function initPhoneReveal() {
    const phones = BlogrUtils.qsAll('.phone');
    if (!phones.length || BlogrUtils.prefersReducedMotion()) return;

    phones.forEach((phone, i) => {
      phone.style.transitionDelay = `${i * 0.12}s`;
    });
  }

  /* ------------------------------------------------------------------ */
  /*  INITIALISE ALL                                                      */
  /* ------------------------------------------------------------------ */

  function init() {
    initScrollReveal();
    initOrbitPause();
    initRipple();
    initHeaderScroll();
    initPhoneReveal();
  }

  return { init };
})();

window.BlogrAnimations = BlogrAnimations;
