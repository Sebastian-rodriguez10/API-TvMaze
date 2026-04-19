const API_BASE = 'https://api.tvmaze.com';

export async function obtenerShows(pagina = 0) {
  const res = await fetch(`${API_BASE}/shows?page=${pagina}`);
  if (!res.ok) throw new Error('Error al obtener shows');
  return res.json();
}