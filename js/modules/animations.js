/* ══════════════════════════════════════
   MODULE: Animations
   Counter animation, scroll fade-ins, particles
   ══════════════════════════════════════ */

const CODE_SNIPPETS = [
  'def predict(x):',  'import numpy as np', 'quantum.circuit()',
  'model.fit(X, y)',  '{ "ai": true }',     'class IAXpert:',
  'qc.h(qubit)',      'loss.backward()',     'ssh -p 443',
  'blockchain.add()', '∇θ = ∂L/∂θ',        'pip install torch',
  'git push origin',  'docker run -d',
];

/**
 * Animates a numeric counter from 0 to its data-target value.
 * Uses cubic ease-out over ~1.8 s.
 */
export function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start    = Date.now();

  const update = () => {
    const progress = Math.min((Date.now() - start) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target);
    if (progress < 1) requestAnimationFrame(update);
  };
  update();
}

/**
 * Registers an IntersectionObserver that:
 * - adds .visible to .fade-in elements when they enter the viewport
 * - triggers counter animations on visible counter elements
 */
export function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');

      entry.target.querySelectorAll('.counter-num[data-target]').forEach(el => {
        if (!el.dataset.animated) {
          el.dataset.animated = '1';
          animateCounter(el);
        }
      });

      if (
        entry.target.classList.contains('counter-num') &&
        entry.target.dataset.target &&
        !entry.target.dataset.animated
      ) {
        entry.target.dataset.animated = '1';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/**
 * Immediately animates counter elements already visible in the hero section
 * (which starts above the fold, so the observer would miss them).
 */
export function animateHeroCounters() {
  document.querySelectorAll('.hero .counter-num[data-target]').forEach(el => {
    if (!el.dataset.animated) {
      el.dataset.animated = '1';
      setTimeout(() => animateCounter(el), 500);
    }
  });
}

/** Spawns floating code-snippet particles in the hero background */
export function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left            = `${Math.random() * 100}%`;
    p.style.animationDuration = `${12 + Math.random() * 18}s`;
    p.style.animationDelay   = `${-Math.random() * 20}s`;
    p.textContent = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
    container.appendChild(p);
  }
}
