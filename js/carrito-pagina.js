// Página del carrito: líneas, cupón y resumen de montos.
const cuerpo = document.getElementById("cuerpo-carrito");
const resumen = document.getElementById("resumen");
const formCupon = document.getElementById("form-cupon");
const mensajeCupon = document.getElementById("mensaje-cupon");
let cuponActivo = "";

function dibujar() {
  if (carrito.items.length === 0) {
    cuerpo.innerHTML = `<tr><td colspan="5" class="vacio">Tu carrito está vacío. Mira el <a href="tienda.html">catálogo</a> y agrega un celular.</td></tr>`;
  } else {
    cuerpo.innerHTML = carrito.items.map(i => `<tr>
      <td>${i.nombre}</td><td>${soles(i.precio)}</td>
      <td><input type="number" min="1" max="${i.stock}" value="${i.cantidad}" data-id="${i.id}" aria-label="Cantidad de ${i.nombre}"></td>
      <td>${soles(i.precio * i.cantidad)}</td>
      <td><button class="btn btn-sec" data-accion="quitar" data-id="${i.id}">Quitar</button></td></tr>`).join("");
  }
  const subtotal = calcularSubtotal(carrito.items);
  const descuento = calcularDescuento(subtotal, cuponActivo);
  const envio = calcularEnvio(subtotal - descuento);
  const igv = calcularIGV(subtotal - descuento);
  const total = calcularTotal(subtotal, descuento, envio);
  resumen.innerHTML = `
    <dt>Subtotal</dt><dd>${soles(subtotal)}</dd>
    <dt>Descuento ${cuponActivo}</dt><dd>- ${soles(descuento)}</dd>
    <dt>Envío</dt><dd>${envio === 0 && subtotal > 0 ? "Gratis" : soles(envio)}</dd>
    <dt>IGV incluido (18%)</dt><dd>${soles(igv)}</dd>
    <dt class="total">Total</dt><dd class="total">${soles(total)}</dd>`;
  actualizarContador();
}

cuerpo.addEventListener("click", e => {
  const btn = e.target.closest("[data-accion='quitar']");
  if (btn) { carrito.quitar(Number(btn.dataset.id)); dibujar(); }
});
cuerpo.addEventListener("change", e => {
  if (e.target.matches("input[type='number']")) {
    carrito.cambiarCantidad(Number(e.target.dataset.id), Number(e.target.value));
    dibujar();
  }
});
formCupon.addEventListener("submit", e => {
  e.preventDefault();
  const codigo = document.getElementById("cupon").value.trim().toUpperCase();
  if (CUPONES[codigo]) { cuponActivo = codigo; mensajeCupon.textContent = `Cupón ${codigo} aplicado: 10% de descuento.`; }
  else { cuponActivo = ""; mensajeCupon.textContent = "Ese cupón no existe. Prueba con CEL10."; }
  dibujar();
});
document.getElementById("vaciar").addEventListener("click", () => { carrito.vaciar(); dibujar(); });
document.addEventListener("DOMContentLoaded", dibujar);
