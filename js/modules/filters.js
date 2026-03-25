/* ══════════════════════════════════════
   MODULE: Filters
   Manages project filter state and rendering
   ══════════════════════════════════════ */

import { projects } from '../data/projects.js';
import { renderCard } from './render.js';

/** Active filter values — one selection per dimension */
export const filters = {
  tipo:   'todos',
  estado: 'todos',
  area:   'todos',
};

/** Re-renders the grid based on current filters + search query */
export function filterProjects() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const grid   = document.getElementById('projectsGrid');

  const filtered = projects.filter(p => {
    const matchTipo   = filters.tipo   === 'todos' || p.tipo === filters.tipo;
    const matchEstado = filters.estado === 'todos' || p.estado === filters.estado;
    const matchArea   = filters.area   === 'todos' || p.area.some(a => a.toLowerCase().includes(filters.area.toLowerCase()));
    const matchSearch = !search ||
      p.nombre.toLowerCase().includes(search) ||
      p.equipo.join(' ').toLowerCase().includes(search) ||
      p.entidad.toLowerCase().includes(search);

    return matchTipo && matchEstado && matchArea && matchSearch;
  });

  grid.innerHTML = filtered.map(renderCard).join('');
  document.getElementById('visibleCount').textContent = filtered.length;
  document.getElementById('totalCount').textContent   = projects.length;
}

/**
 * Updates a filter dimension and re-renders.
 * Called from onclick handlers in the HTML.
 */
export function setFilter(key, val, btn) {
  filters[key] = val;
  btn.parentElement
    .querySelectorAll('.filter-btn')
    .forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filterProjects();
}
