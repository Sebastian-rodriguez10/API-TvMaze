import { obtenerFavoritos, toggleFavorito } from './percistence.js';

const contenedor = document.getElementById('contenedor-favoritos');

function renderizarFavoritos() {
    const favoritos = obtenerFavoritos();

    
    if (favoritos.length === 0) {
        contenedor.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 20px;">
                <p>Aún no has guardado ninguna serie.</p>
                <a href="../PaginaPrincipal.html" style="color: #ffb7b2; text-decoration: none;">Ir a buscar series</a>
            </div>`;
        return;
    }

    
    contenedor.innerHTML = '';

    
    favoritos.forEach(serie => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta'); 

        tarjeta.innerHTML = `
            <img src="${serie.image?.medium || ''}" alt="${serie.name}">
            <div class="info-card">
                <h3>${serie.name}</h3>
                <button class="btn-eliminar" data-id="${serie.id}">Eliminar</button>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });

    
    document.querySelectorAll('.btn-eliminar').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const serieAEliminar = favoritos.find(s => s.id == id);
            
            if (serieAEliminar) {
                toggleFavorito(serieAEliminar);
                renderizarFavoritos(); 
            }
        });
    });
}


renderizarFavoritos();