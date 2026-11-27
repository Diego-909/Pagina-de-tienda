// tienda.js — catálogo dinámico: búsqueda, filtro por categoría, orden y detalle en modal de Bootstrap.
const contenedor = document.getElementById("catalogo");
const buscador = document.getElementById("buscador");
const selectCategoria = document.getElementById("categoria");
const selectOrden = document.getElementById("orden");
const modalDetalle = new bootstrap.Modal("#detalle");

const ORDENES = {
  "nombre": (a, b) => a.nombre.localeCompare(b.nombre, "es"),
  "precio-asc": (a, b) => a.precio - b.precio,
  "precio-desc": (a, b) => b.precio - a.precio
};

function filtrar() {
  const texto = buscador.value.trim().toLowerCase();
  const cat = selectCategoria.value;
  return catalogo.filter(p =>
    p.nombre.toLowerCase().includes(texto) && (cat === "todas" || p.categoria === cat));
}
function mostrar() {
  // filter() ya devuelve una copia y [...lista] ordena otra: el array original no se altera
  const lista = [...filtrar()].sort(ORDENES[selectOrden.value]);
  contenedor.innerHTML = lista.length
    ? lista.map(p => p.plantilla()).join("")
    : `<div class="col-12"><div class="alert alert-info mb-0">No encontramos celulares con ese nombre. Borra la búsqueda o cambia la categoría.</div></div>`;
}
function abrirDetalle(id) {
  const p = catalogo.find(x => x.id === id);
  document.getElementById("detalle-titulo").textContent = p.nombre;
  document.getElementById("detalle-cuerpo").innerHTML = `
    <div class="row g-3 align-items-center">
      <div class="col-12 col-md-5"><img src="${p.imagen}" class="img-fluid rounded" alt="Celular ${p.nombre}" width="480" height="480"></div>
      <div class="col-12 col-md-7">
        <p class="small text-primary mb-1">${p.categoria}</p>
        <p>${p.descripcion}</p>
        <p>Stock disponible: ${p.stock}</p>
        <p class="fw-bold fs-4 mb-0">${p.precioFormateado()}</p>
      </div>
    </div>`;
  const agregar = document.getElementById("detalle-agregar");
  agregar.dataset.id = p.id;
  agregar.disabled = !p.hayStock();
  modalDetalle.show();   // Bootstrap atrapa el foco, cierra con Esc y devuelve el foco al botón
}

document.addEventListener("DOMContentLoaded", () => {
  [...new Set(catalogo.map(p => p.categoria))].forEach(c => selectCategoria.add(new Option(c, c)));
  mostrar();
});
buscador.addEventListener("input", mostrar);
selectCategoria.addEventListener("change", mostrar);
selectOrden.addEventListener("change", mostrar);
document.getElementById("filtros").addEventListener("submit", e => e.preventDefault());
contenedor.addEventListener("click", e => {
  const btn = e.target.closest("[data-accion='detalle']");
  if (btn) abrirDetalle(Number(btn.dataset.id));
});
