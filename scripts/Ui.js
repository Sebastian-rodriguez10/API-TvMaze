import { state } from './State.js';
import { esFavorito, toggleFavorito } from './Persistence.js';

const contenedor = document.querySelector('.tarjetas');
const paginacion  = document.getElementById('paginacion');
const resultado   = document.getElementById('resultado');

export function renderTarjetas() {
  contenedor.innerHTML = '';
  const inicio = state.pagina * state.porPagina;
  const pagina = state.shows.slice(inicio, inicio + state.porPagina);

  if (!pagina.length) {
    contenedor.innerHTML = '<p style="text-align:center;color:#aaa;">No hay resultados.</p>';
    renderPaginacion();
    return;
  }

  pagina.forEach(show => {
    const div = document.createElement('div');
    div.className = 'tarjeta';

    const img = show.image
      ? `<img src="${show.image.medium}" alt="${show.name}" style="width:100%;border-radius:4px;margin-bottom:8px;">`
      : `<div style="height:160px;background:#333;border-radius:4px;margin-bottom:8px;display:flex;align-items:center;justify-content:center;color:#666;">Sin imagen</div>`;

    const fav = esFavorito(show.id);

    div.innerHTML = `
      ${img}
      <h3 style="margin:4px 0;font-size:1rem;">${show.name}</h3>
      <p style="margin:2px 0;font-size:0.78rem;color:#aaa;">${show.genres?.join(', ') || ''}</p>
      <p style="margin:4px 0;font-size:0.85rem;">${show.rating?.average ? '⭐ ' + show.rating.average : ''}</p>
      <button class="btn-fav" style="background:${fav ? '#e50914' : '#333'};margin-top:8px;font-size:0.8rem;padding:6px 14px;">
        ${fav ? '★ Quitar' : '☆ Favorito'}
      </button>
    `;