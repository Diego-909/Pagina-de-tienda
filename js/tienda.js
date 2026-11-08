// Catálogo dinámico: búsqueda, filtro por categoría y detalle en modal.
const contenedor = document.getElementById("catalogo");
const buscador = document.getElementById("buscador");
const selectCategoria = document.getElementById("categoria");
const modal = document.getElementById("modal");
const modalCuerpo = document.getElementById("modal-cuerpo");

function filtrar() {
  const texto = buscador.value.trim().toLowerCase();
  const cat = selectCategoria.value;
  return catalogo.filter(p =>
    p.nombre.toLowerCase().includes(texto) && (cat === "todas" || p.categoria === cat));
}
function mostrar() {
  const lista = filtrar();
  contenedor.innerHTML = lista.length
    ? lista.map(p => p.plantilla()).join("")
    : `<p class="vacio">No encontramos celulares con ese nombre. Borra la búsqueda o cambia la categoría.</p>`;
}
function abrirDetalle(id) {
  const p = catalogo.find(x => x.id === id);
  modalCuerpo.innerHTML = `<img src="${p.imagen}" alt="Celular ${p.nombre}">
    <div><h2 id="modal-titulo">${p.nombre}</h2><p class="etiqueta">${p.categoria}</p>
    <p>${p.descripcion}</p><p>Stock disponible: ${p.stock}</p>
    <p class="precio">${p.precioFormateado()}</p>
    <button class="btn" data-accion="agregar" data-id="${p.id}" ${p.hayStock() ? "" : "disabled"}>Agregar al carrito</button></div>`;
  modal.hidden = false;
  modal.querySelector(".cerrar").focus();
}
function cerrarDetalle() { modal.hidden = true; }

document.addEventListener("DOMContentLoaded", () => {
  const categorias = [...new Set(catalogo.map(p => p.categoria))];
  categorias.forEach(c => selectCategoria.add(new Option(c, c)));
  mostrar();
});
buscador.addEventListener("input", mostrar);
selectCategoria.addEventListener("change", mostrar);
contenedor.addEventListener("click", e => {
  const btn = e.target.closest("[data-accion='detalle']");
  if (btn) abrirDetalle(Number(btn.dataset.id));
});
modal.addEventListener("click", e => {
  if (e.target === modal || e.target.closest(".cerrar")) cerrarDetalle();
});
document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) cerrarDetalle(); });
