/* ══════════════════════════════════════
   MODULE: Render
   Generates HTML strings for project cards
   ══════════════════════════════════════ */

import { projects } from '../data/projects.js';

/** Maps project type to CSS badge class */
export function getTipoBadgeClass(tipo) {
  const map = {
    'MVP':                  'badge-mvp',
    'Investigación Aplicada':'badge-investigacion',
    'Memorias':             'badge-memorias',
    'Ponencia':             'badge-ponencia',
    'Ideas/Propuestas':     'badge-ideas',
  };
  return map[tipo] ?? 'badge-mvp';
}

/** Maps project status to CSS badge class */
export function getEstadoBadgeClass(estado) {
  const map = {
    'Pruebas funcionales':    'badge-pruebas',
    'Aprobado':               'badge-aprobado',
    'Esperando publicación':  'badge-esperando',
    'Entregado sin respuesta':'badge-entregado',
    'En revisión':            'badge-revision',
  };
  return map[estado] ?? 'badge-entregado';
}

/** Renders a single project card HTML string */
export function renderCard(p) {
  const teamText =
    p.equipo.slice(0, 2).join(', ') +
    (p.equipo.length > 2 ? ` +${p.equipo.length - 2} más` : '');

  const radicadoLabel =
    p.radicado !== 'N/A' && p.radicado !== 'EN REVISIÓN' && p.radicado !== 'PROPUESTA'
      ? `Rad. ${p.radicado}`
      : p.radicado;

  return `
    <div class="project-card" onclick="openModal(${p.id})">
      <div class="card-header">
        <div class="card-avatar" style="background:${p.color}">${p.initials}</div>
        <div class="card-title-area">
          <div class="card-title">${p.nombre}</div>
          <div class="card-badges">
            <span class="badge ${getTipoBadgeClass(p.tipo)}">${p.tipo}</span>
            <span class="badge ${getEstadoBadgeClass(p.estado)}">${p.estado}</span>
          </div>
        </div>
      </div>
      <div class="card-area-chip">◈ ${p.area.join(' · ')}</div>
      <div class="card-team"><strong>Equipo:</strong> ${teamText}</div>
      <div class="card-entidad">${p.entidad}</div>
      <div class="card-footer">
        <span class="card-radicado">${radicadoLabel}</span>
        <div style="display:flex;gap:.4rem;align-items:center">
          ${p.infoLink ? `<a href="${p.infoLink}" target="_blank" rel="noopener noreferrer"
            class="btn-info" onclick="event.stopPropagation()">📄 Más info ↗</a>` : ''}
          <button class="btn-ver">Ver más →</button>
        </div>
      </div>
    </div>`;
}
