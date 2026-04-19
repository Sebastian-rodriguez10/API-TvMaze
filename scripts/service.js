const API_BASE = 'https://api.tvmaze.com';

export async function obtenerShows(pagina = 0) {
  const res = await fetch(`${API_BASE}/shows?page=${pagina}`);
  if (!res.ok) throw new Error('Error al obtener shows');
  return res.json();
}

export async function buscarShows(query) {
  const res = await fetch(`${API_BASE}/search/shows?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Error en la búsqueda');
  const data = await res.json();
  return data.map(item => item.show);
}