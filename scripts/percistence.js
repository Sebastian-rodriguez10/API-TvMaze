const KEY_FAV     = 'favoritos';
const KEY_HIST    = 'historial';
const KEY_PAGINA  = 'porPagina';

export function getFavoritos() {
  return JSON.parse(localStorage.getItem(KEY_FAV) || '[]');
}

export function toggleFavorito(show) {
  let favs = getFavoritos();
  const existe = favs.some(f => f.id === show.id);
  if (existe) {
    favs = favs.filter(f => f.id !== show.id);
  } else {
    favs.push(show);
  }
  localStorage.setItem(KEY_FAV, JSON.stringify(favs));
  return !existe;
}

export function esFavorito(id) {
  return getFavoritos().some(f => f.id === id);
}

export function getHistorial() {
  return JSON.parse(localStorage.getItem(KEY_HIST) || '[]');
}

export function agregarHistorial(query) {
  let hist = getHistorial();
  hist = hist.filter(q => q !== query);
  hist.unshift(query);
  if (hist.length > 5) hist = hist.slice(0, 5);
  localStorage.setItem(KEY_HIST, JSON.stringify(hist));
  return hist;
}

export function guardarPorPagina(valor) {
  localStorage.setItem(KEY_PAGINA, valor);
}