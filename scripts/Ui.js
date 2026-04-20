import { buscarShows, obtenerShows } from './service.js';
import { getFavoritos, esFavorito, toggleFavorito, agregarHistorial, getHistorial, guardarPorPagina } from './percistence.js';
import { state } from './state.js';

const contenedor         = document.querySelector('.tarjetas');
const paginacion         = document.getElementById('paginacion');
const resultado          = document.getElementById('resultado');
const historialContainer = document.getElementById('historial-container');
const filtrosContainer   = document.getElementById('filtros-container');

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

export function renderHistorial(onBuscar) {
  historialContainer.innerHTML = '';
  const hist = getHistorial();
  if (!hist.length) return;

  const titulo = document.createElement('p');
  titulo.textContent = 'Búsquedas recientes:';
  titulo.style.cssText = 'color:#aaa;font-size:0.85rem;margin-bottom:6px;';
  historialContainer.appendChild(titulo);

  const lista = document.createElement('div');
  lista.style.cssText = 'display:flex;flex-wrap:wrap;justify-content:center;gap:6px;';

  hist.forEach(query => {
    const btn = document.createElement('button');
    btn.textContent = query;
    btn.style.cssText = 'background:#333;font-size:0.8rem;padding:5px 12px;';
    btn.addEventListener('click', () => onBuscar(query));
    lista.appendChild(btn);
  });

  historialContainer.appendChild(lista);
}

export function renderFiltros() {
  filtrosContainer.innerHTML = '';
 const generos = ['Todos', ...new Set(
  state.showsOriginales.flatMap(s => s.genres || [])
)].sort((a, b) => {
  if (a === 'Todos') return -1;
  if (b === 'Todos') return 1;
  return a.localeCompare(b);
});
  const titulo = document.createElement('p');
  titulo.textContent = 'Filtrar por género:';
  titulo.style.cssText = 'color:#aaa;font-size:0.85rem;margin-bottom:6px;';
  filtrosContainer.appendChild(titulo);

  const lista = document.createElement('div');
  lista.style.cssText = 'display:flex;flex-wrap:wrap;justify-content:center;gap:6px;';

  generos.forEach(genero => {
    const btn = document.createElement('button');
    btn.textContent = genero;
    btn.style.background = state.filtroGenero === genero ? '#e50914' : '#333';
    btn.addEventListener('click', () => {
      state.filtroGenero = genero;
      state.shows = genero === 'Todos'
        ? [...state.showsOriginales]
        : state.showsOriginales.filter(s => s.genres?.includes(genero));
      state.pagina = 0;
      renderTarjetas();
      renderFiltros();
    });
    lista.appendChild(btn);
  });

  filtrosContainer.appendChild(lista);
}

export let ejecutarBusqueda;

export function registrarEventos(cargarInicio) {
  const inputPelicula = document.getElementById('pelicula');
  const selectPagina  = document.getElementById('porPagina');

  selectPagina.value = state.porPagina;

  ejecutarBusqueda = async (query) => {
    inputPelicula.value = query;
    state.modoFav = false;
    document.getElementById('btnFav').textContent = 'Películas favoritas';
    setResultado('Buscando...');
    try {
      state.shows           = await buscarShows(query);
      state.showsOriginales = [...state.shows];
      state.pagina          = 0;
      state.filtroGenero    = 'Todos';
      agregarHistorial(query);
      setResultado(`${state.shows.length} resultado(s) para "${query}" — Endpoint: https://api.tvmaze.com/search/shows?q=${query}`);
      document.title = `Buscando: ${query} | TVMaze`;
      renderHistorial(ejecutarBusqueda);
      renderFiltros();
      renderTarjetas();
    } catch (err) {
      setResultado('Error: ' + err.message);
    }
  };

  document.getElementById('formPelis').addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = inputPelicula.value.trim();
    if (!query) return;
    await ejecutarBusqueda(query);
  });

  inputPelicula.addEventListener('input', async (e) => {
    if (e.target.value.trim() === '') {
      state.modoFav = false;
      state.filtroGenero = 'Todos';
      await cargarInicio();
    }
  });

  selectPagina.addEventListener('change', (e) => {
    state.porPagina = parseInt(e.target.value);
    guardarPorPagina(state.porPagina);
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