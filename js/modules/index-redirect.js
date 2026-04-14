/* ══════════════════════════════════════
   MODULE: Index Redirect
   On index.html, redirects to proyectos.html
   whenever any filter is active or search has content.
   ══════════════════════════════════════ */

/** Active filter values — one selection per dimension */
export const filters = {
  tipo:   'todos',
  estado: 'todos',
  area:   'todos',
};

/**
 * If any filter or search is active, builds URL params
 * and navigates to proyectos.html. Does nothing when
 * everything is at its default "todos"/empty state.
 */
export function filterProjects() {
  const search = (document.getElementById('searchInput')?.value ?? '').trim();
  const params = new URLSearchParams();

  if (search)                      params.set('q',      search);
  if (filters.tipo   !== 'todos')  params.set('tipo',   filters.tipo);
  if (filters.estado !== 'todos')  params.set('estado', filters.estado);
  if (filters.area   !== 'todos')  params.set('area',   filters.area);

  if (params.toString()) {
    window.location.href = `proyectos.html?${params.toString()}`;
  }
}

/**
 * Updates a single filter dimension and triggers the redirect check.
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
