/* ══════════════════════════════════════
   MODULE: Navbar
   Scroll shadow + mobile hamburger menu
   ══════════════════════════════════════ */

/** Adds/removes the .scrolled class on the navbar based on scroll position */
export function initNavbarScroll() {
  window.addEventListener('scroll', () => {
    document.getElementById('navbar')
      .classList.toggle('scrolled', window.scrollY > 50);
  });
}

/** Toggles the mobile menu open/close */
export function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

/** Closes the mobile menu (called from nav link clicks) */
export function closeMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
}
