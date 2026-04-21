const porPaginaGuardada = parseInt(localStorage.getItem('porPagina') || '6');

export const state = {
  shows: [],
  showsOriginales: [],
  pagina: 0,
  modoFav: false,
  porPagina: porPaginaGuardada,
  filtroGenero: 'Todos',
  historial: JSON.parse(localStorage.getItem('historial') || '[]')
};