import { obtenerShows } from './service.js';
import { state } from './state.js';
import { renderTarjetas, setResultado, registrarEventos, renderHistorial, renderFiltros, ejecutarBusqueda } from './Ui.js';

export async function cargarInicio() {
  setResultado('Cargando...');
  try {
    state.shows           = await obtenerShows(0);
    state.showsOriginales = [...state.shows];
    state.pagina          = 0;
    state.filtroGenero    = 'Todos';
    setResultado('Endpoint: https://api.tvmaze.com/shows?page=0');
    document.title = 'Pagina principal | TVMaze';
    renderFiltros();
    renderHistorial(ejecutarBusqueda);
    renderTarjetas();
  } catch (err) {
    setResultado('Error al cargar: ' + err.message);
  }
}

registrarEventos(cargarInicio);
cargarInicio();