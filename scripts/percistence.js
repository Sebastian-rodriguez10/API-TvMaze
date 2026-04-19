const KEY = 'favoritos';

export function getFavoritos() {
  return JSON.parse(localStorage.getItem(KEY) || '[]');
}

export function toggleFavorito(show) {
  let favs = getFavoritos();
  const existe = favs.some(f => f.id === show.id);
  if (existe) {
    favs = favs.filter(f => f.id !== show.id);
  } else {
    favs.push(show);
  }
  localStorage.setItem(KEY, JSON.stringify(favs));
  return !existe; 
}

export function esFavorito(id) {
  return getFavoritos().some(f => f.id === id);
}