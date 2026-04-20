const contenedor = document.getElementById('detalle');

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

async function cargarDetalle() {
    try {
        const res = await fetch(`https://api.tvmaze.com/shows/${id}`);
        const show = await res.json();

        contenedor.innerHTML = `
            <div class="imagen">
                <img src="${show.image?.original || ''}" alt="${show.name}">
            </div>

            <div class="detallesPelicula">
                <h2>${show.name}</h2>

                <p class="descripcion">
                    ${show.summary || 'Sin descripción'}
                </p>

                <p><strong>Géneros:</strong> ${show.genres.join(', ')}</p>
                <p><strong>Rating:</strong> ${show.rating.average || 'N/A'}</p>
                <p><strong>Idioma:</strong> ${show.language}</p>
                <p><strong>Estado:</strong> ${show.status}</p>
                <p><strong>Estreno:</strong> ${show.premiered}</p>

                <div class="botonFavoritos">
                    <a href="PaginaPrincipal.html">
                        <button class="botonVolver">Volver</button>
                    </a>
                </div>
            </div>
        `;

    } catch (error) {
        contenedor.innerHTML = `<p>Error al cargar detalles</p>`;
    }
}

cargarDetalle();
