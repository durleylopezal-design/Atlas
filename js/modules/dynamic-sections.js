/* ══════════════════════════════════════════════════════
   DYNAMIC SECTIONS — reads from localStorage and renders
   Software, Gallery (Galería), and Team (Equipo) sections
   on index.html. Falls back to seed data on first visit.
══════════════════════════════════════════════════════ */

import { initialSoftware, initialGaleria, initialEquipo } from '../data/initial-data.js';

const KEYS = {
  software: 'iaxpert_software',
  galeria:  'iaxpert_galeria',
  equipo:   'iaxpert_equipo',
};

/* ─── Load / Seed ─── */
function loadOrSeed(key, initial) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) { /* ignore */ }
  // First visit: seed with initial data
  localStorage.setItem(key, JSON.stringify(initial));
  return initial;
}

/* ══════════════════════════════════════════
   SOFTWARE CARDS
══════════════════════════════════════════ */
const SW_GRADIENTS = {
  '#0e4f6b': 'linear-gradient(135deg,#0e4f6b 0%,#093b52 60%,#041e2a 100%)',
  '#007B99': 'linear-gradient(135deg,#007B99 0%,#005877 60%,#003a52 100%)',
  '#b45309': 'linear-gradient(135deg,#b45309 0%,#92400e 60%,#78350f 100%)',
  '#2E7D32': 'linear-gradient(135deg,#2E7D32 0%,#1b5e20 60%,#0a3d0a 100%)',
  '#3949AB': 'linear-gradient(135deg,#3949AB 0%,#283593 60%,#1a237e 100%)',
  '#00897B': 'linear-gradient(135deg,#00897B 0%,#00695C 60%,#004D40 100%)',
};

function swGradient(color) {
  return SW_GRADIENTS[color] || `linear-gradient(135deg,${color} 0%,${color}cc 60%,${color}88 100%)`;
}

const SW_STATUS_LABEL = {
  'En desarrollo': 'En desarrollo activo',
  'Discovery':     'Discovery completada',
  'En diseño':     'En fase de diseño',
  'MVP disponible':'MVP disponible',
};

function renderSoftwareCard(s) {
  const grad   = swGradient(s.color || '#007B99');
  const status = SW_STATUS_LABEL[s.estado] || s.estado;
  const mods   = (s.modulos || []).map(m => {
    const [title, ...rest] = m.split(':');
    return `<div class="software-module-item">
      <div class="software-module-dot" style="background:${s.color||'#007B99'};"></div>
      <span>${rest.length ? `<strong>${title}:</strong>${rest.join(':')}` : m}</span>
    </div>`;
  }).join('');

  const chips = (s.tecnologias || []).map(t =>
    `<span class="stack-chip" style="background:rgba(0,123,153,0.1);color:#005877;">${t}</span>`
  ).join('');

  const demoBtn = s.demo
    ? `<a href="${s.demo}" target="_blank" rel="noopener noreferrer" class="btn-secondary-card">Ver más ↗</a>`
    : '';

  return `
  <div class="software-card fade-in">
    <div class="software-card-hero" style="background:${grad};">
      <div class="software-card-hero-pattern"></div>
      <div class="software-card-hero-glyph">${s.codigo||'SW'}</div>
      <div class="software-card-status">
        <div class="software-card-status-dot"></div>
        ${status}
      </div>
      <div class="software-card-hero-meta">
        <div class="software-card-icon-wrap">💻</div>
        <div>
          <div class="software-card-type-tag">Producto de Software · IAXpert</div>
          <div class="software-card-title">${s.titulo}</div>
        </div>
      </div>
    </div>
    <div class="software-card-body">
      <p class="software-card-subtitle">${s.descripcion}</p>
      ${mods ? `<div class="software-modules-title">Capacidades del sistema</div>${mods}` : ''}
      <div class="software-stack">${chips}</div>
    </div>
    <div class="software-card-footer">
      ${s.linkedin
        ? `<a href="${s.linkedin}" target="_blank" class="btn-contact" style="background:${s.color||'#007B99'};">Conocer más &rarr;</a>`
        : ''}
      ${demoBtn}
    </div>
  </div>`;
}

export function initSoftwareSection() {
  const container = document.getElementById('software-dynamic-grid');
  if (!container) return;
  const data = loadOrSeed(KEYS.software, initialSoftware);
  container.innerHTML = data.map(renderSoftwareCard).join('');
  if (window.lucide) lucide.createIcons();
}

/* ══════════════════════════════════════════
   GALLERY / CAROUSELS
══════════════════════════════════════════ */
let _carouselState = {}; // track current slide per carousel

function renderCarousel(event, index) {
  const carId = `carousel-dyn-${event.id}`;
  const imgs = (event.imagenes || []);
  const total = imgs.length;

  const slides = imgs.map((url, i) => {
    const isImg = /\.(jpe?g|png|gif|webp|svg)$/i.test(url);
    const media = isImg
      ? `<img src="${url}" alt="" loading="lazy">`
      : `<video controls preload="none" playsinline><source src="${url}" type="video/mp4"></video>`;
    return `<div class="carousel-slide${i === 0 ? ' active' : ''}">${media}</div>`;
  }).join('');

  const prevBtn = total > 1
    ? `<button class="carousel-btn carousel-btn-prev" onclick="dynCarouselMove('${carId}',-1)">&#8249;</button>`
    : '';
  const nextBtn = total > 1
    ? `<button class="carousel-btn carousel-btn-next" onclick="dynCarouselMove('${carId}',1)">&#8250;</button>`
    : '';

  const eventNum = String(index + 1).padStart(2, '0');

  return `
  <div class="carousel-block fade-in">
    <div class="carousel-event-header">
      <span class="carousel-event-num">Evento ${eventNum}</span>
      <h3 class="carousel-event-title">${event.titulo}</h3>
    </div>
    <div class="carousel-wrapper">
      <div class="carousel-track" id="${carId}">${slides}</div>
      ${prevBtn}
      ${nextBtn}
      <div class="carousel-counter" id="${carId}-counter">1 / ${total}</div>
    </div>
  </div>`;
}

// Expose carousel controls globally so onclick works
window.dynCarouselMove = function(carId, dir) {
  const track  = document.getElementById(carId);
  if (!track) return;
  const slides = track.querySelectorAll('.carousel-slide');
  if (!slides.length) return;

  if (!_carouselState[carId]) _carouselState[carId] = 0;
  slides[_carouselState[carId]].classList.remove('active');
  _carouselState[carId] = (_carouselState[carId] + dir + slides.length) % slides.length;
  slides[_carouselState[carId]].classList.add('active');

  const counter = document.getElementById(carId + '-counter');
  if (counter) counter.textContent = `${_carouselState[carId] + 1} / ${slides.length}`;
};

export function initGaleriaSection() {
  const container = document.getElementById('galeria-dynamic-container');
  if (!container) return;

  /* Hide hardcoded carousel blocks (siblings within .gallery-inner) */
  const galleryInner = container.closest('.gallery-inner');
  if (galleryInner) {
    galleryInner.querySelectorAll('.carousel-block').forEach(c => {
      c.style.display = 'none';
    });
  }

  const data = loadOrSeed(KEYS.galeria, initialGaleria);
  container.innerHTML = data.map((evt, i) => renderCarousel(evt, i)).join('');
}

/* ══════════════════════════════════════════
   TEAM / EQUIPO
══════════════════════════════════════════ */
const LINKEDIN_SVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;
const GITHUB_SVG   = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>`;
const CVLAC_SVG    = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>`;

function socialLinks(m) {
  const links = [];
  if (m.linkedin) links.push(`<a href="${m.linkedin}" target="_blank" class="social-link linkedin" title="LinkedIn">${LINKEDIN_SVG}</a>`);
  if (m.github)   links.push(`<a href="${m.github}"   target="_blank" class="social-link github"   title="GitHub">${GITHUB_SVG}</a>`);
  if (m.cvlac)    links.push(`<a href="${m.cvlac}"    target="_blank" class="social-link cvlac"    title="CvLAC">${CVLAC_SVG}</a>`);
  return links.length ? `<div class="equipo-social-links">${links.join('')}</div>` : '';
}

function renderLiderCard(m) {
  return `
  <div class="lider-card">
    <div class="lider-avatar" style="background:${m.color||'#007B99'}">${m.iniciales}</div>
    <div>
      <div class="lider-name">${m.nombre}</div>
      <div class="lider-role">${m.rol}</div>
      ${m.correo ? `<div class="lider-email">${m.correo}</div>` : ''}
      <div class="lider-social">${socialLinks(m)}</div>
    </div>
  </div>`;
}

function renderEquipoCard(m) {
  return `
  <div class="equipo-card">
    <div class="equipo-avatar" style="background:${m.color||'#007B99'}">${m.iniciales}</div>
    <div class="equipo-name">${m.nombre}</div>
    <div class="equipo-role-tag">${m.rol}</div>
    ${m.semilleroColab ? `<div style="font-size:.72rem;color:rgba(255,255,255,.45);margin-top:.2rem">${m.semilleroColab}</div>` : ''}
    ${socialLinks(m)}
  </div>`;
}

export function initEquipoSection() {
  const lideresContainer = document.getElementById('equipo-dynamic-lideres');
  const gridContainer    = document.getElementById('equipo-dynamic-grid');
  if (!lideresContainer && !gridContainer) return;

  /* Hide hardcoded grids so only dynamic ones show */
  document.querySelectorAll('.lideres-grid:not(#equipo-dynamic-lideres)').forEach(el => {
    el.style.display = 'none';
  });
  document.querySelectorAll('.equipo-grid:not(#equipo-dynamic-grid)').forEach(el => {
    el.style.display = 'none';
  });
  /* Also hide the static "Semillero Colaborador DIPOL" label + grid below */
  document.querySelectorAll('.equipo-section-label').forEach(el => {
    if (el.textContent.includes('DIPOL')) el.style.display = 'none';
  });

  const data = loadOrSeed(KEYS.equipo, initialEquipo);
  const lideres       = data.filter(m => m.rol === 'Líder' || m.rol === 'Profesor Investigador');
  const semilleristas = data.filter(m => m.rol !== 'Líder' && m.rol !== 'Profesor Investigador');

  if (lideresContainer) lideresContainer.innerHTML = lideres.map(renderLiderCard).join('');
  if (gridContainer)    gridContainer.innerHTML    = semilleristas.map(renderEquipoCard).join('');
}

/* ══════════════════════════════════════════
   INIT ALL
══════════════════════════════════════════ */
export function initDynamicSections() {
  initSoftwareSection();
  initGaleriaSection();
  initEquipoSection();
}
