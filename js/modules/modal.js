/* ══════════════════════════════════════
   MODULE: Modal
   Project detail overlay
   ══════════════════════════════════════ */

import { projects } from '../data/projects.js';
import { getTipoBadgeClass, getEstadoBadgeClass } from './render.js';

/** Opens the detail modal for a given project ID */
export function openModal(id) {
  const p = projects.find(x => x.id === id);
  if (!p) return;

  document.getElementById('modalBody').innerHTML = `
    <div class="modal-type-bar" style="background:${p.color}"></div>
    <div class="modal-avatar" style="background:${p.color}">${p.initials}</div>
    <div class="modal-title">${p.nombre}</div>

    <div class="modal-badges">
      <span class="badge ${getTipoBadgeClass(p.tipo)}">${p.tipo}</span>
      <span class="badge ${getEstadoBadgeClass(p.estado)}">${p.estado}</span>
      ${p.area.map(a => `<span class="badge badge-mvp">${a}</span>`).join('')}
    </div>

    <div class="modal-divider"></div>

    <div class="modal-grid">
      <div class="modal-section">
        <div class="modal-section-label">Radicado</div>
        <div class="modal-section-value" style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:1.1rem;">
          ${p.radicado}
        </div>
      </div>
      <div class="modal-section">
        <div class="modal-section-label">Estado</div>
        <div class="modal-section-value">
          <span class="badge ${getEstadoBadgeClass(p.estado)}" style="font-size:13px;">${p.estado}</span>
        </div>
      </div>
    </div>

    <div class="modal-section">
      <div class="modal-section-label">Entidad / Convocatoria</div>
      <div class="modal-section-value">${p.entidad}</div>
    </div>
    <div class="modal-section">
      <div class="modal-section-label">Equipo de Investigación</div>
      <div class="modal-section-value">${p.equipo.join('<br>')}</div>
    </div>
    <div class="modal-section">
      <div class="modal-section-label">Área Temática</div>
      <div class="modal-section-value">${p.area.join(' · ')}</div>
    </div>

    <div class="modal-divider"></div>
    <div style="font-size:12px;color:var(--gray);text-align:center;">
      Semillero IAXpert | Universidad Católica Luis Amigó — 2025
    </div>`;

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

/** Closes the modal when clicking the backdrop */
export function closeModal(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModalBtn();
}

/** Closes the modal unconditionally */
export function closeModalBtn() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/** Keyboard handler — close on Escape */
export function initModalKeyboard() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModalBtn();
  });
}
