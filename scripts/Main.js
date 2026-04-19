import { obtenerShows } from './service.js';
import { state } from './state.js';
import { renderTarjetas, setResultado, registrarEventos } from './Ui.js';

async function cargarInicio() {
  setResultado('Cargando...');
  try {
    state.shows  = await obtenerShows(0);
    state.pagina = 0;
    setResultado('Endpoint: https://api.tvmaze.com/shows?page=0');
    document.title = 'Pagina principal | TVMaze';
    renderTarjetas();
  } catch (err) {
    setResultado('Error al cargar: ' + err.message);
  }
}

registrarEventos(cargarInicio);
cargarInicio();