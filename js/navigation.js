/**
 * navigation.js — Desktop dropdowns + mobile menu
 *
 * Responsibilities:
 *  - Desktop: keyboard-accessible dropdown menus
 *  - Mobile: slide-in panel with accordion submenus
 *  - Focus trapping inside mobile menu
 *  - Close on outside click / Escape key
 *  - ARIA attributes kept in sync with open/closed state
 */

'use strict';

const BlogrNavigation = (() => {
  /* ------------------------------------------------------------------ */
  /*  Internal state                                                      */
  /* ------------------------------------------------------------------ */
  const state = {
    /** Currently open desktop dropdown trigger element, or null */
    activeDropdown: null,
    /** Whether the mobile menu is open */
    mobileOpen: false,
    /** Cleanup fn returned by trapFocus — called on menu close */
    releaseFocus: null,
  };

  /* ------------------------------------------------------------------ */
  /*  Element references (populated in init)                             */
  /* ------------------------------------------------------------------ */
  const el = {
    hamburger:    null,
    mobileMenu:   null,
    menuOverlay:  null,
    closeBtn:     null,
    triggers:     [],   // desktop dropdown triggers
    mobileTriggers: [], // mobile accordion triggers
  };

  /* ------------------------------------------------------------------ */
  /*  DESKTOP DROPDOWNS                                                   */
  /* ------------------------------------------------------------------ */

  /**
   * Open a desktop dropdown.
   * @param {HTMLButtonElement} trigger
   */
  function openDropdown(trigger) {
    const dropdownId = trigger.getAttribute('aria-controls');
    const dropdown   = document.getElementById(dropdownId);
    if (!dropdown) return;

    // Close any previously open dropdown first
    if (state.activeDropdown && state.activeDropdown !== trigger) {
      closeDropdown(state.activeDropdown);
    }

    trigger.setAttribute('aria-expanded', 'true');
    dropdown.classList.add('is-open');
    state.activeDropdown = trigger;
  }

  /**
   * Close a desktop dropdown.
   * @param {HTMLButtonElement} trigger
   */
  function closeDropdown(trigger) {
    const dropdownId = trigger.getAttribute('aria-controls');
    const dropdown   = document.getElementById(dropdownId);
    if (!dropdown) return;

    trigger.setAttribute('aria-expanded', 'false');
    dropdown.classList.remove('is-open');

    if (state.activeDropdown === trigger) {
      state.activeDropdown = null;
    }
  }

  /** Close all open desktop dropdowns. */
  function closeAllDropdowns() {
    el.triggers.forEach(closeDropdown);
  }

  /**
   * Bind desktop dropdown events (hover + keyboard).
   */
  function bindDesktopDropdowns() {
    el.triggers.forEach((trigger) => {
      const item = trigger.closest('.nav__item');

      // Pointer enter/leave on the list item
      item.addEventListener('pointerenter', () => openDropdown(trigger));
      item.addEventListener('pointerleave', () => closeDropdown(trigger));

      // Click toggle (keyboard users)
      trigger.addEventListener('click', () => {
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';
        isOpen ? closeDropdown(trigger) : openDropdown(trigger);
      });

      // Keyboard: Escape closes
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closeDropdown(trigger);
          trigger.focus();
        }
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (state.activeDropdown && !e.target.closest('.nav__item--dropdown')) {
        closeAllDropdowns();
      }
    });

    // Close on Escape anywhere
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.activeDropdown) {
        closeAllDropdowns();
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /*  MOBILE MENU                                                         */
  /* ------------------------------------------------------------------ */

  /** Open the mobile menu. */
  function openMobileMenu() {
    el.mobileMenu.removeAttribute('hidden');
    document.body.style.overflow = 'hidden'; // prevent bg scroll

    el.hamburger.setAttribute('aria-expanded', 'true');
    el.hamburger.setAttribute('aria-label', 'Close navigation menu');
    state.mobileOpen = true;

    // Trap focus inside the panel
    const panel = el.mobileMenu.querySelector('.mobile-menu__panel');
    state.releaseFocus = BlogrUtils.trapFocus(panel);

    // Animate in
    requestAnimationFrame(() => {
      el.mobileMenu.classList.add('is-open');
    });
  }

  /** Close the mobile menu. */
  function closeMobileMenu() {
    el.mobileMenu.setAttribute('hidden', '');
    el.mobileMenu.classList.remove('is-open');
    document.body.style.overflow = '';

    el.hamburger.setAttribute('aria-expanded', 'false');
    el.hamburger.setAttribute('aria-label', 'Open navigation menu');
    state.mobileOpen = false;

    // Release focus trap and return focus to hamburger
    if (state.releaseFocus) {
      state.releaseFocus();
      state.releaseFocus = null;
    }
    el.hamburger.focus();

    // Collapse all open submenus
    el.mobileTriggers.forEach(closeMobileSubmenu);
  }

  /**
   * Toggle a mobile accordion submenu.
   * @param {HTMLButtonElement} trigger
   */
  function toggleMobileSubmenu(trigger) {
    const submenuId = trigger.getAttribute('aria-controls');
    const submenu   = document.getElementById(submenuId);
    if (!submenu) return;

    const isOpen = trigger.getAttribute('aria-expanded') === 'true';

    if (isOpen) {
      closeMobileSubmenu(trigger);
    } else {
      openMobileSubmenu(trigger);
    }
  }

  /**
   * @param {HTMLButtonElement} trigger
   */
  function openMobileSubmenu(trigger) {
    const submenuId = trigger.getAttribute('aria-controls');
    const submenu   = document.getElementById(submenuId);
    if (!submenu) return;

    trigger.setAttribute('aria-expanded', 'true');
    submenu.removeAttribute('hidden');
  }

  /**
   * @param {HTMLButtonElement} trigger
   */
  function closeMobileSubmenu(trigger) {
    const submenuId = trigger.getAttribute('aria-controls');
    const submenu   = document.getElementById(submenuId);
    if (!submenu) return;

    trigger.setAttribute('aria-expanded', 'false');
    submenu.setAttribute('hidden', '');
  }

  /**
   * Bind mobile menu events.
   */
  function bindMobileMenu() {
    // Hamburger open
    el.hamburger.addEventListener('click', () => {
      state.mobileOpen ? closeMobileMenu() : openMobileMenu();
    });

    // Close button
    el.closeBtn.addEventListener('click', closeMobileMenu);

    // Overlay click
    el.menuOverlay.addEventListener('click', closeMobileMenu);

    // Escape key
    el.mobileMenu.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileMenu();
    });

    // Accordion submenus
    el.mobileTriggers.forEach((trigger) => {
      trigger.addEventListener('click', () => toggleMobileSubmenu(trigger));
    });

    // Close menu when a link is tapped
    const mobileLinks = el.mobileMenu.querySelectorAll('.mobile-menu__link');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  /* ------------------------------------------------------------------ */
  /*  INITIALISE                                                          */
  /* ------------------------------------------------------------------ */

  function init() {
    el.hamburger      = document.getElementById('hamburgerBtn');
    el.mobileMenu     = document.getElementById('mobileMenu');
    el.menuOverlay    = document.getElementById('menuOverlay');
    el.closeBtn       = document.getElementById('closeMenuBtn');
    el.triggers       = BlogrUtils.qsAll('.nav__trigger');
    el.mobileTriggers = BlogrUtils.qsAll('.mobile-menu__trigger');

    if (!el.hamburger || !el.mobileMenu) return;

    bindDesktopDropdowns();
    bindMobileMenu();
  }

  return { init, closeMobileMenu, closeAllDropdowns };
})();

window.BlogrNavigation = BlogrNavigation;
