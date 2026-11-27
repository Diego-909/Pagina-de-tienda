// comun.js — código compartido por todas las páginas: clases, cálculos, carrito lateral y avisos.
const IGV = 0.18;
const CUPONES = { CEL10: 0.10 };
const ENVIO_BASE = 20;
const ENVIO_GRATIS_DESDE = 1500;

const redondear = n => Math.round(n * 100) / 100;
const soles = n => "S/ " + redondear(n).toFixed(2);
const esc = t => String(t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

class Producto {
  constructor(datos) { Object.assign(this, datos); }
  hayStock() { return this.stock > 0; }
  precioFormateado() { return soles(this.precio); }
  // Tarjeta de Bootstrap dentro de una columna de la rejilla
  plantilla() {
    return `<div class="col">
      <article class="card h-100 tarjeta-producto">
        <img src="${this.imagen}" class="card-img-top" alt="Celular ${this.nombre}" width="480" height="480" loading="lazy">
        <div class="card-body d-flex flex-column">
          <span class="small text-primary">${this.categoria}</span>
          <h3 class="h5 card-title">${this.nombre}</h3>
          <p class="card-text fw-bold fs-5">${this.precioFormateado()}</p>
          <div class="mt-auto d-flex flex-wrap gap-2">
            <button type="button" class="btn btn-outline-primary" data-accion="detalle" data-id="${this.id}">Ver detalle<span class="visually-hidden"> de ${this.nombre}</span></button>
            <button type="button" class="btn btn-primary" data-accion="agregar" data-id="${this.id}" ${this.hayStock() ? "" : "disabled"}>${this.hayStock() ? `Agregar<span class="visually-hidden"> ${this.nombre}</span>` : "Agotado"}</button>
          </div>
        </div>
      </article>
    </div>`;
  }
}

class Carrito {
  constructor() { this.items = []; this.cargar(); }
  cargar() {
    try {
      const datos = JSON.parse(localStorage.getItem("carrito"));
      this.items = Array.isArray(datos) ? datos : [];
    } catch (e) { this.items = []; }
  }
  guardar() {
    try { localStorage.setItem("carrito", JSON.stringify(this.items)); } catch (e) { console.warn("Sin almacenamiento"); }
  }
  buscar(id) { return this.items.find(i => i.id === id); }
  agregar(p) {
    const item = this.buscar(p.id);
    if (item) {
      if (item.cantidad >= p.stock) return false;
      item.cantidad++;
    } else {
      this.items.push({ id: p.id, nombre: p.nombre, precio: p.precio, stock: p.stock, cantidad: 1 });
    }
    this.guardar();
    return true;
  }
  cambiarCantidad(id, cantidad) {
    const item = this.buscar(id);
    if (!item) return;
    cantidad = Math.min(Math.floor(cantidad) || 0, item.stock);
    if (cantidad <= 0) { this.quitar(id); return; }
    item.cantidad = cantidad;
    this.guardar();
  }
  quitar(id) { this.items = this.items.filter(i => i.id !== id); this.guardar(); }
  vaciar() { this.items = []; this.guardar(); }
  totalItems() { return this.items.reduce((t, i) => t + i.cantidad, 0); }
}

// Cálculos (los precios ya incluyen IGV)
function calcularSubtotal(items) { return redondear(items.reduce((t, i) => t + i.precio * i.cantidad, 0)); }
function calcularDescuento(subtotal, cupon) { return redondear(subtotal * (CUPONES[cupon] || 0)); }
function calcularEnvio(monto) {
  if (monto <= 0) return 0;
  return monto >= ENVIO_GRATIS_DESDE ? 0 : ENVIO_BASE;
}
function calcularIGV(montoConIGV) { return redondear(montoConIGV - montoConIGV / (1 + IGV)); }
function calcularTotal(subtotal, descuento, envio) { return redondear(subtotal - descuento + envio); }

// El cupón se guarda para que el checkout lo respete
function leerCupon() {
  try { const c = localStorage.getItem("cupon"); return CUPONES[c] ? c : ""; } catch (e) { return ""; }
}
function guardarCupon(c) {
  try { c ? localStorage.setItem("cupon", c) : localStorage.removeItem("cupon"); } catch (e) { /* sin almacenamiento */ }
}

const carrito = new Carrito();
const catalogo = productos.map(d => new Producto(d));

function resumenCarrito(entrega = "domicilio") {
  const subtotal = calcularSubtotal(carrito.items);
  const cupon = leerCupon();
  const descuento = calcularDescuento(subtotal, cupon);
  const neto = subtotal - descuento;
  const envio = entrega === "recojo" ? 0 : calcularEnvio(neto);
  return { subtotal, cupon, descuento, envio, igv: calcularIGV(neto), total: calcularTotal(subtotal, descuento, envio), entrega };
}
function htmlResumen(r) {
  return `<dt>Subtotal</dt><dd>${soles(r.subtotal)}</dd>
    <dt>Descuento ${esc(r.cupon)}</dt><dd>- ${soles(r.descuento)}</dd>
    <dt>Envío</dt><dd>${r.envio === 0 && r.subtotal > 0 ? "Gratis" : soles(r.envio)}</dd>
    <dt>IGV incluido (18%)</dt><dd>${soles(r.igv)}</dd>
    <dt class="total">Total</dt><dd class="total">${soles(r.total)}</dd>`;
}

// ---- Avisos (toast de Bootstrap con role="status") ----
function avisar(mensaje) {
  const el = document.getElementById("toast-aviso");
  if (!el) return;
  el.querySelector(".toast-body").textContent = mensaje;
  bootstrap.Toast.getOrCreateInstance(el, { delay: 2500 }).show();
}

// ---- Contador y carrito lateral (offcanvas) ----
function actualizarContador() {
  document.querySelectorAll(".contador").forEach(c => { c.textContent = carrito.totalItems(); });
}
function pintarOffcanvas() {
  const lineas = document.getElementById("carrito-lineas");
  const pie = document.getElementById("carrito-pie");
  if (!lineas) return;
  if (carrito.items.length === 0) {
    lineas.innerHTML = `<p>Tu carrito está vacío. Mira el <a href="tienda.html">catálogo</a> y agrega un celular.</p>`;
    pie.hidden = true;
    return;
  }
  lineas.innerHTML = `<ul class="list-unstyled mb-0">` + carrito.items.map(i => `
    <li class="d-flex flex-wrap align-items-center justify-content-between gap-2 border-bottom py-2">
      <div><strong>${esc(i.nombre)}</strong><br><span>${soles(i.precio * i.cantidad)}</span></div>
      <div class="d-flex align-items-center gap-2">
        <label class="visually-hidden" for="oc-${i.id}">Cantidad de ${esc(i.nombre)}</label>
        <input type="number" id="oc-${i.id}" class="form-control cantidad" min="1" max="${i.stock}" value="${i.cantidad}" data-id="${i.id}">
        <button type="button" class="btn btn-outline-primary" data-accion="quitar" data-id="${i.id}">Quitar<span class="visually-hidden"> ${esc(i.nombre)}</span></button>
      </div>
    </li>`).join("") + `</ul>`;
  const r = resumenCarrito();
  document.getElementById("carrito-total").textContent = soles(r.total);
  pie.hidden = false;
}
// Cualquier cambio en el carrito avisa con un evento y cada parte se redibuja sola
function cambioCarrito() { document.dispatchEvent(new Event("carrito:cambio")); }
document.addEventListener("carrito:cambio", () => { actualizarContador(); pintarOffcanvas(); });

document.addEventListener("DOMContentLoaded", () => {
  actualizarContador();
  pintarOffcanvas();
  const destacados = document.getElementById("destacados");
  if (destacados) destacados.innerHTML = catalogo.slice(3, 7).map(p => p.plantilla()).join("");
});

// Delegación de eventos: un solo listener para agregar/quitar/cambiar cantidad
document.addEventListener("click", e => {
  const agregar = e.target.closest("[data-accion='agregar']");
  if (agregar) {
    const p = catalogo.find(x => x.id === Number(agregar.dataset.id));
    avisar(carrito.agregar(p) ? `${p.nombre} agregado al carrito` : `No hay más stock de ${p.nombre}`);
    cambioCarrito();
  }
  const quitar = e.target.closest("#carrito-lineas [data-accion='quitar']");
  if (quitar) { carrito.quitar(Number(quitar.dataset.id)); cambioCarrito(); }
});
document.addEventListener("change", e => {
  if (e.target.matches("#carrito-lineas input[type='number']")) {
    carrito.cambiarCantidad(Number(e.target.dataset.id), Number(e.target.value));
    cambioCarrito();
  }
});
