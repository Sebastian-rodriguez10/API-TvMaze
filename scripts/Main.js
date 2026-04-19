import { obtenerShows, buscarShows } from './service.js';
import { getFavoritos } from './Persistence.js';
import { state } from './state.js';
import { renderTarjetas, setResultado, irAPagina } from './Ui.js';

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
    setResultado('');
    state.modoFav = false;
    state.shows  = await obtenerShows(0);
    state.pagina = 0;
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
  } else {
    document.getElementById('btnFav').textContent = 'Películas favoritas';
    cargarInicio();
    return;
  }
  renderTarjetas();
});

document.getElementById('porPagina').addEventListener('change', (e) => {
  state.porPagina = parseInt(e.target.value);
  state.pagina = 0;
  renderTarjetas();
});