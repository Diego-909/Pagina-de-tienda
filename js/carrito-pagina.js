// carrito-pagina.js — líneas, cupón y resumen de montos.
const cuerpo = document.getElementById("cuerpo-carrito");
const resumen = document.getElementById("resumen");
const formCupon = document.getElementById("form-cupon");
const mensajeCupon = document.getElementById("mensaje-cupon");
const btnPagar = document.getElementById("ir-checkout");

function dibujar() {
  if (carrito.items.length === 0) {
    cuerpo.innerHTML = `<tr><td colspan="5">Tu carrito está vacío. Mira el <a href="tienda.html">catálogo</a> y agrega un celular.</td></tr>`;
  } else {
    cuerpo.innerHTML = carrito.items.map(i => `<tr>
      <td>${esc(i.nombre)}</td><td>${soles(i.precio)}</td>
      <td><input type="number" class="form-control cantidad" min="1" max="${i.stock}" value="${i.cantidad}" data-id="${i.id}" aria-label="Cantidad de ${esc(i.nombre)}"></td>
      <td>${soles(i.precio * i.cantidad)}</td>
      <td><button type="button" class="btn btn-outline-primary" data-accion="quitar" data-id="${i.id}">Quitar<span class="visually-hidden"> ${esc(i.nombre)}</span></button></td></tr>`).join("");
  }
  resumen.innerHTML = htmlResumen(resumenCarrito());
  const vacio = carrito.items.length === 0;
  btnPagar.classList.toggle("disabled", vacio);
  btnPagar.setAttribute("aria-disabled", vacio);
  btnPagar.tabIndex = vacio ? -1 : 0;
}

cuerpo.addEventListener("click", e => {
  const btn = e.target.closest("[data-accion='quitar']");
  if (btn) { carrito.quitar(Number(btn.dataset.id)); cambioCarrito(); }
});
cuerpo.addEventListener("change", e => {
  if (e.target.matches("input[type='number']")) {
    carrito.cambiarCantidad(Number(e.target.dataset.id), Number(e.target.value));
    cambioCarrito();
  }
});
formCupon.addEventListener("submit", e => {
  e.preventDefault();
  const codigo = document.getElementById("cupon").value.trim().toUpperCase();
  if (CUPONES[codigo]) {
    guardarCupon(codigo);
    mensajeCupon.textContent = `Cupón ${codigo} aplicado: 10% de descuento.`;
  } else {
    guardarCupon("");
    mensajeCupon.textContent = "Ese cupón no existe. Prueba con CEL10.";
  }
  cambioCarrito();
});
document.getElementById("vaciar").addEventListener("click", () => { carrito.vaciar(); cambioCarrito(); });
document.addEventListener("carrito:cambio", dibujar);
document.addEventListener("DOMContentLoaded", () => {
  if (leerCupon()) {
    document.getElementById("cupon").value = leerCupon();
    mensajeCupon.textContent = `Cupón ${leerCupon()} aplicado: 10% de descuento.`;
  }
  dibujar();
});
