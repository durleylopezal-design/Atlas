/* ══════════════════════════════════════
   MAIN ENTRY POINT — proyectos.html
   Reads URL params, pre-applies filters,
   renders the project grid, and handles
   real-time filtering without redirecting.
   ══════════════════════════════════════ */

import { projects }                           from './data/projects.js';
import { renderCard }                         from './modules/render.js';
import { initScrollAnimations }               from './modules/animations.js';
import { initNavbarScroll, toggleMenu,
         closeMenu }                          from './modules/navbar.js';
import { openModal, closeModal, closeModalBtn,
         initModalKeyboard }                  from './modules/modal.js';

/* ── Active filter state ── */
const filters = {
  tipo:   'todos',
  estado: 'todos',
  area:   'todos',
};

/* ── Core filter + render ── */
function filterProjects() {
  const search = (document.getElementById('searchInput')?.value ?? '').toLowerCase();
  const grid   = document.getElementById('projectsGrid');

  const filtered = projects.filter(p => {
    const matchTipo   = filters.tipo   === 'todos' || p.tipo === filters.tipo;
    const matchEstado = filters.estado === 'todos' || p.estado === filters.estado;
    const matchArea   = filters.area   === 'todos' ||
                        p.area.some(a => a.toLowerCase().includes(filters.area.toLowerCase()));
    const matchSearch = !search ||
      p.nombre.toLowerCase().includes(search) ||
      p.equipo.join(' ').toLowerCase().includes(search) ||
      p.entidad.toLowerCase().includes(search);

    return matchTipo && matchEstado && matchArea && matchSearch;
  });

  grid.innerHTML = filtered.length
    ? filtered.map(renderCard).join('')
    : `<div class="projects-empty">
         <div class="projects-empty-icon">🔍</div>
         <p>No se encontraron proyectos con los filtros seleccionados.</p>
         <button class="filter-btn" onclick="clearFilters()">Limpiar filtros</button>
       </div>`;

  document.getElementById('visibleCount').textContent = filtered.length;
  document.getElementById('totalCount').textContent   = projects.length;

  /* Sync URL params without page reload */
  const params = new URLSearchParams();
  const q = document.getElementById('searchInput')?.value.trim() ?? '';
  if (q)                      params.set('q',      q);
  if (filters.tipo   !== 'todos') params.set('tipo',   filters.tipo);
  if (filters.estado !== 'todos') params.set('estado', filters.estado);
  if (filters.area   !== 'todos') params.set('area',   filters.area);
  const qs = params.toString();
  history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
}

function setFilter(key, val, btn) {
  filters[key] = val;
  btn.parentElement
    .querySelectorAll('.filter-btn')
    .forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filterProjects();
}

function clearFilters() {
  filters.tipo   = 'todos';
  filters.estado = 'todos';
  filters.area   = 'todos';
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const attr = btn.getAttribute('onclick') ?? '';
    const match = attr.match(/setFilter\('([^']+)','([^']+)',this\)/);
    if (match) btn.classList.toggle('active', match[2] === 'todos');
  });
  filterProjects();
}

/* ── Expose to window for onclick handlers ── */
window.filterProjects = filterProjects;
window.setFilter      = setFilter;
window.clearFilters   = clearFilters;
window.openModal      = openModal;
window.closeModal     = closeModal;
window.closeModalBtn  = closeModalBtn;
window.toggleMenu     = toggleMenu;
window.closeMenu      = closeMenu;

/* ── Read URL params and activate the matching filter buttons ── */
function applyURLParams() {
  const params = new URLSearchParams(window.location.search);
  const q      = params.get('q')      ?? '';
  const tipo   = params.get('tipo')   ?? 'todos';
  const estado = params.get('estado') ?? 'todos';
  const area   = params.get('area')   ?? 'todos';

  const searchInput = document.getElementById('searchInput');
  if (searchInput && q) searchInput.value = q;

  filters.tipo   = tipo;
  filters.estado = estado;
  filters.area   = area;

  /* Activate the buttons whose onclick matches each dimension/value */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const attr  = btn.getAttribute('onclick') ?? '';
    const match = attr.match(/setFilter\('([^']+)','([^']+)',this\)/);
    if (!match) return;
    const [, dim, val] = match;
    const activeVal = filters[dim] ?? 'todos';
    btn.classList.toggle('active', val === activeVal);
  });
}

/* ── Bootstrap ── */
document.addEventListener('DOMContentLoaded', () => {
  applyURLParams();
  filterProjects();
  initScrollAnimations();
  initNavbarScroll();
  initModalKeyboard();

  if (window.lucide) lucide.createIcons();
});
