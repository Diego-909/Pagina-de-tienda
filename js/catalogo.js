const grilla = document.getElementById('catalogo');
const buscar = document.getElementById('buscar');
const categoria = document.getElementById('categoria');
const resultados = document.getElementById('resultados');
const modal = document.getElementById('modal');

// R5 · plantilla de tarjeta
function plantilla(p) {
  return `<article class="tarjeta">
    <img src="${p.imagen}" alt="${p.nombre}">
    <h3>${p.nombre}</h3>
    <span>${p.categoria}</span>
    <span class="precio">${soles(p.precio)}</span>
    <span>${p.stock > 0 ? 'Stock: ' + p.stock : 'Agotado'}</span>
    <div class="botones">
      <button class="btn" data-accion="detalle" data-id="${p.id}">Detalle</button>
      <button class="btn" data-accion="agregar" data-id="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>Agregar</button>
    </div>
  </article>`;
}

function mostrar() {
  const texto = buscar.value.trim().toLowerCase();
  const lista = PRODUCTOS.filter(p =>
    (p.nombre + ' ' + p.descripcion).toLowerCase().includes(texto) &&
    (!categoria.value || p.categoria === categoria.value));
  grilla.innerHTML = lista.map(plantilla).join('');
  resultados.textContent = lista.length ? lista.length + ' producto(s)' : 'No se encontraron productos.';
}

document.addEventListener('DOMContentLoaded', () => {
  [...new Set(PRODUCTOS.map(p => p.categoria))].forEach(c => categoria.innerHTML += `<option>${c}</option>`);
  mostrar();
});

buscar.addEventListener('input', mostrar);        // evento input
categoria.addEventListener('change', mostrar);    // evento change

// R7 · delegación: un solo listener para todos los botones
grilla.addEventListener('click', e => {           // evento click
  const boton = e.target.closest('button');
  if (!boton) return;
  const id = Number(boton.dataset.id);
  const p = PRODUCTOS.find(x => x.id === id);
  if (boton.dataset.accion === 'agregar') {
    carrito.agregar(id);
    boton.textContent = '¡Agregado!';
    setTimeout(() => boton.textContent = 'Agregar', 800);
  } else {
    document.getElementById('modal-contenido').innerHTML =
      `<img src="${p.imagen}" alt="${p.nombre}" width="200"><h2>${p.nombre}</h2><p>${p.descripcion}</p><p class="precio">${soles(p.precio)}</p>`;
    modal.showModal();
  }
});

document.getElementById('cerrar').addEventListener('click', () => modal.close());
