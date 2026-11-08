// Cálculos (R6): funciones con nombre
const TASA_IGV = 0.18;
const ENVIO_GRATIS_DESDE = 300;
const COSTO_ENVIO = 15;

function redondear(n) { return Math.round(n * 100) / 100; }
function soles(n) { return 'S/ ' + redondear(n).toFixed(2); }
function calcularSubtotal(precio, cantidad) { return redondear(precio * cantidad); }
function calcularDescuento(subtotal, cupon) { return redondear(subtotal * (CUPONES[cupon] || 0)); }
function calcularEnvio(monto) { return monto <= 0 ? 0 : (monto >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO); }
function calcularIGV(monto) { return redondear(monto - monto / (1 + TASA_IGV)); } // el precio ya incluye IGV

function calcularResumen(items, cupon) {
  const subtotal = redondear(items.reduce((s, i) => s + calcularSubtotal(i.producto.precio, i.cantidad), 0));
  const descuento = calcularDescuento(subtotal, cupon);
  const neto = redondear(subtotal - descuento);
  const envio = calcularEnvio(neto);
  return { subtotal, descuento, igv: calcularIGV(neto), envio, total: redondear(neto + envio) };
}

// R4 · Clase propia con persistencia (R8)
class Carrito {
  constructor() {
    this.items = [];   // { id, cantidad }
    this.cupon = '';
    this.cargar();
  }
  cargar() {
    try {
      const datos = JSON.parse(localStorage.getItem('carrito'));
      if (datos) {
        this.items = datos.items.filter(i => PRODUCTOS.some(p => p.id === i.id));
        this.cupon = datos.cupon || '';
      }
    } catch (e) { /* si falla, empieza vacío */ }
  }
  guardar() {
    localStorage.setItem('carrito', JSON.stringify({ items: this.items, cupon: this.cupon }));
    actualizarContador();
  }
  agregar(id) {
    const producto = PRODUCTOS.find(p => p.id === id);
    const linea = this.items.find(i => i.id === id);
    const actual = linea ? linea.cantidad : 0;
    if (actual >= producto.stock) return;
    if (linea) linea.cantidad++; else this.items.push({ id, cantidad: 1 });
    this.guardar();
  }
  cambiar(id, delta) {
    const linea = this.items.find(i => i.id === id);
    const producto = PRODUCTOS.find(p => p.id === id);
    const nueva = linea.cantidad + delta;
    if (nueva <= 0) return this.quitar(id);
    if (nueva > producto.stock) return;
    linea.cantidad = nueva;
    this.guardar();
  }
  quitar(id) { this.items = this.items.filter(i => i.id !== id); this.guardar(); }
  vaciar() { this.items = []; this.cupon = ''; this.guardar(); }
  poner(codigo) {
    const c = codigo.trim().toUpperCase();
    if (!CUPONES[c]) return false;
    this.cupon = c;
    this.guardar();
    return true;
  }
  unidades() { return this.items.reduce((s, i) => s + i.cantidad, 0); }
  detalle() { return this.items.map(i => ({ producto: PRODUCTOS.find(p => p.id === i.id), cantidad: i.cantidad })); }
}

const carrito = new Carrito();

function actualizarContador() { document.getElementById('contador').textContent = carrito.unidades(); }
document.addEventListener('DOMContentLoaded', actualizarContador);
