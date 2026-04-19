import { buscarShows, obtenerShows } from './service.js';
import { getFavoritos, esFavorito, toggleFavorito } from './Persistence.js';
import { state } from './state.js';

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

    div.querySelector('.btn-fav').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorito(show);
      renderTarjetas();
    });

    contenedor.appendChild(div);
  });

  renderPaginacion();
}

function renderPaginacion() {
  paginacion.innerHTML = '';
  const total = Math.ceil(state.shows.length / state.porPagina);
  const desde = Math.max(0, state.pagina - 3);
  const hasta  = Math.min(total - 1, state.pagina + 3);

  for (let i = desde; i <= hasta; i++) {
    const btn = document.createElement('button');
    btn.textContent = i + 1;
    if (i === state.pagina) btn.style.background = '#e50914';
    btn.addEventListener('click', () => {
      state.pagina = i;
      renderTarjetas();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    paginacion.appendChild(btn);
  }
}

export function setResultado(texto) {
  resultado.textContent = texto;
}

export function irAPagina(n) {
  const total = Math.ceil(state.shows.length / state.porPagina);
  state.pagina = Math.max(0, Math.min(n, total - 1));
  renderTarjetas();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function registrarEventos(cargarInicio) {
  document.getElementById('formPelis').addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = document.getElementById('pelicula').value.trim();
    if (!query) return;
    state.modoFav = false;
    document.getElementById('btnFav').textContent = 'Películas favoritas';
    setResultado('Buscando...');
    try {
      state.shows  = await buscarShows(query);
      state.pagina = 0;
      setResultado(`${state.shows.length} resultado(s) para "${query}" — Endpoint: https://api.tvmaze.com/search/shows?q=${query}`);
      document.title = `Buscando: ${query} | TVMaze`;
      renderTarjetas();
    } catch (err) {
      setResultado('Error: ' + err.message);
    }
  });

  document.getElementById('pelicula').addEventListener('input', async (e) => {
    if (e.target.value.trim() === '') {
      state.modoFav = false;
      state.shows  = await obtenerShows(0);
      state.pagina = 0;
      setResultado('Endpoint: https://api.tvmaze.com/shows?page=0');
      document.title = 'Pagina principal | TVMaze';
      renderTarjetas();
    }
  });

  document.getElementById('btnFav').addEventListener('click', () => {
    state.modoFav = !state.modoFav;
    if (state.modoFav) {
      state.shows  = getFavoritos();
      state.pagina = 0;
      document.getElementById('btnFav').textContent = '← Volver';
      setResultado(`${state.shows.length} favorito(s)`);
      document.title = 'Favoritos | TVMaze';
      renderTarjetas();
    } else {
      document.getElementById('btnFav').textContent = 'Películas favoritas';
      cargarInicio();
    }
  });

  document.getElementById('porPagina').addEventListener('change', (e) => {
    state.porPagina = parseInt(e.target.value);
    state.pagina = 0;
    renderTarjetas();
  });

  document.getElementById('btnPrev').addEventListener('click', () => irAPagina(state.pagina - 1));
  document.getElementById('btnNext').addEventListener('click', () => irAPagina(state.pagina + 1));
  document.getElementById('menos2').addEventListener('click', () => irAPagina(state.pagina - 2));
  document.getElementById('mas2').addEventListener('click',   () => irAPagina(state.pagina + 2));
  document.getElementById('menos5').addEventListener('click', () => irAPagina(state.pagina - 5));
  document.getElementById('mas5').addEventListener('click',   () => irAPagina(state.pagina + 5));
}