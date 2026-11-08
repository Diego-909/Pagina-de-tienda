
// Código compartido por todas las páginas: clases, cálculos y utilidades.
const IGV = 0.18;
const CUPONES = { CEL10: 0.10 };
const ENVIO_BASE = 20;
const ENVIO_GRATIS_DESDE = 1500;

const redondear = n => Math.round(n * 100) / 100;
const soles = n => "S/ " + redondear(n).toFixed(2);

class Producto {
  constructor(datos) { Object.assign(this, datos); }
  hayStock() { return this.stock > 0; }
  precioFormateado() { return soles(this.precio); }
  plantilla() {
    return `<article class="tarjeta">
      <img src="${this.imagen}" alt="Celular ${this.nombre}">
      <span class="etiqueta">${this.categoria}</span>
      <h3>${this.nombre}</h3>
      <p class="precio">${this.precioFormateado()}</p>
      <div class="acciones">
        <button class="btn btn-sec" data-accion="detalle" data-id="${this.id}">Ver detalle</button>
        <button class="btn" data-accion="agregar" data-id="${this.id}" ${this.hayStock() ? "" : "disabled"}>${this.hayStock() ? "Agregar" : "Agotado"}</button>
      </div>
    </article>`;
  }
}

class Carrito {
  constructor() { this.items = []; this.cargar(); }
  cargar() {
    try {
      const datos = JSON.parse(localStorage.getItem("carrito"));
      this.items = Array.isArray(datos) ? datos : [];
    } catch (e) {
      this.items = [];
    }
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

// Funciones de cálculo (los precios ya incluyen IGV)
function calcularSubtotal(items) { return redondear(items.reduce((t, i) => t + i.precio * i.cantidad, 0)); }
function calcularDescuento(subtotal, cupon) { return redondear(subtotal * (CUPONES[cupon] || 0)); }
function calcularEnvio(montoProductos) {
  if (montoProductos <= 0) return 0;
  return montoProductos >= ENVIO_GRATIS_DESDE ? 0 : ENVIO_BASE;
}
function calcularIGV(montoConIGV) { return redondear(montoConIGV - montoConIGV / (1 + IGV)); }
function calcularTotal(subtotal, descuento, envio) { return redondear(subtotal - descuento + envio); }

const carrito = new Carrito();
const catalogo = productos.map(d => new Producto(d));

function actualizarContador() {
  document.querySelectorAll(".contador").forEach(c => { c.textContent = carrito.totalItems(); });
}
function avisar(mensaje) {
  const aviso = document.getElementById("aviso");
  if (!aviso) return;
  aviso.textContent = mensaje;
  aviso.classList.add("visible");
  clearTimeout(avisar.t);
  avisar.t = setTimeout(() => aviso.classList.remove("visible"), 2500);
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarContador();

  const destacados = document.getElementById("destacados");
  if (destacados) destacados.innerHTML = catalogo.slice(3, 7).map(p => p.plantilla()).join("");
});

// Delegación de eventos: un solo listener para todos los botones "Agregar"
document.addEventListener("click", e => {
  const btn = e.target.closest("[data-accion='agregar']");
  if (btn) {
    const p = catalogo.find(x => x.id === Number(btn.dataset.id));
    avisar(carrito.agregar(p) ? `${p.nombre} agregado al carrito` : `No hay más stock de ${p.nombre}`);
    actualizarContador();
  }
  const menuBtn = e.target.closest(".menu-btn");
  if (menuBtn) {
    const abierto = document.getElementById("nav").classList.toggle("abierto");
    menuBtn.setAttribute("aria-expanded", abierto);
  }
});
