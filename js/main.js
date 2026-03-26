/* ══════════════════════════════════════
   MAIN ENTRY POINT
   Bootstraps all modules on DOMContentLoaded
   ══════════════════════════════════════ */

import { filterProjects, setFilter } from './modules/filters.js';
import { openModal, closeModal, closeModalBtn, initModalKeyboard } from './modules/modal.js';
import { initScrollAnimations, animateHeroCounters, createParticles } from './modules/animations.js';
import { initNavbarScroll, toggleMenu, closeMenu } from './modules/navbar.js';
import { initCarousels } from './modules/carousel.js';

/* ── Expose functions that the HTML calls via onclick ── */
window.filterProjects = filterProjects;
window.setFilter      = setFilter;
window.openModal      = openModal;
window.closeModal     = closeModal;
window.closeModalBtn  = closeModalBtn;
window.toggleMenu     = toggleMenu;
window.closeMenu      = closeMenu;

/* ── Bootstrap ── */
document.addEventListener('DOMContentLoaded', () => {
  filterProjects();
  createParticles();
  initScrollAnimations();
  animateHeroCounters();
  initNavbarScroll();
  initModalKeyboard();
  initCarousels();

  if (window.lucide) lucide.createIcons();
});
