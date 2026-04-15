/* ══════════════════════════════════════
   MAIN ENTRY POINT — index.html
   Uses redirect-based filter behaviour: any active
   filter or search sends the user to proyectos.html.
   Dynamic sections (software, gallery, team) are
   rendered from localStorage (seeded on first visit).
   ══════════════════════════════════════ */

import { filterProjects, setFilter }          from './modules/index-redirect.js';
import { openModal, closeModal, closeModalBtn,
         initModalKeyboard }                  from './modules/modal.js';
import { initScrollAnimations,
         animateHeroCounters,
         createParticles }                    from './modules/animations.js';
import { initNavbarScroll, toggleMenu,
         closeMenu }                          from './modules/navbar.js';
import { initCarousels }                      from './modules/carousel.js';
import { initDynamicSections }                from './modules/dynamic-sections.js';

/* ── Expose functions called by HTML onclick handlers ── */
window.filterProjects = filterProjects;
window.setFilter      = setFilter;
window.openModal      = openModal;
window.closeModal     = closeModal;
window.closeModalBtn  = closeModalBtn;
window.toggleMenu     = toggleMenu;
window.closeMenu      = closeMenu;

/* ── Bootstrap ── */
document.addEventListener('DOMContentLoaded', () => {
  /* Note: filterProjects() is intentionally NOT called here —
     the index no longer renders a project grid, it only redirects
     when the user actively sets a filter or types in the search box. */
  createParticles();
  initScrollAnimations();
  animateHeroCounters();
  initNavbarScroll();
  initModalKeyboard();

  /* Render dynamic sections from localStorage */
  initDynamicSections();

  /* Carousels are now handled by dynamic-sections for the gallery;
     initCarousels() still handles any non-dynamic carousels if present */
  initCarousels();

  if (window.lucide) lucide.createIcons();
});
