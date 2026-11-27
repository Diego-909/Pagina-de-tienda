// checkout.js — un formulario, tres pasos, validación por paso.
const $form = document.getElementById("checkout");
let pasoActual = 1;

// Cada regla devuelve true o el mensaje de error
const REGLAS = {
  nombre: v => v.trim().length >= 3 || "Escribe tu nombre completo (mínimo 3 letras).",
  celular: v => /^9\d{8}$/.test(v) || "Debe tener 9 dígitos y empezar con 9.",
  direccion: v => v.trim().length >= 6 || "Escribe tu dirección (calle y número).",
  distrito: v => v.trim().length >= 3 || "Escribe tu distrito.",
  entrega: v => v !== "" || "Elige cómo recibir tu pedido.",
  pago: v => v !== "" || "Elige cómo vas a pagar."
};
const CAMPOS = { 1: ["nombre", "celular", "direccion", "distrito"], 2: ["entrega", "pago"] };
const ETIQUETA = {
  domicilio: "Envío a domicilio", recojo: "Recojo en tienda",
  "contra-entrega": "Pago contra entrega", billetera: "Billetera digital al recibir"
};

function mostrarPaso(n) {
  pasoActual = n;
  document.querySelectorAll("[data-paso]").forEach(s => { s.hidden = Number(s.dataset.paso) !== n; });
  if (n === 3) pintarResumen();
  document.getElementById("t" + n).focus();   // el lector de pantalla anuncia el paso
}

function validarPaso(n) {
  let primerError = null;
  CAMPOS[n].forEach(nombre => {
    const control = $form.elements[nombre];            // input o grupo de radios
    const r = REGLAS[nombre](control.value);
    const ok = r === true;
    const nodos = control.length !== undefined && !control.tagName ? [...control] : [control];
    nodos.forEach(c => { c.classList.toggle("is-invalid", !ok); c.setAttribute("aria-invalid", !ok); });
    const err = document.getElementById("error-" + nombre);
    err.textContent = ok ? "" : r;
    err.classList.toggle("d-block", !ok);
    if (!ok && !primerError) primerError = nodos[0];
  });
  primerError?.focus();
  return primerError === null;
}

function pintarResumen() {
  const d = new FormData($form);
  const r = resumenCarrito(d.get("entrega"));
  const filas = carrito.items.map(i =>
    `<tr><td>${esc(i.nombre)}</td><td>${i.cantidad}</td><td class="text-end">${soles(i.precio * i.cantidad)}</td></tr>`).join("");
  document.getElementById("resumen-pedido").innerHTML = `
    <div class="table-responsive"><table class="table align-middle">
      <thead><tr><th>Producto</th><th>Cant.</th><th class="text-end">Subtotal</th></tr></thead><tbody>${filas}</tbody></table></div>
    <h3 class="h6">Envío</h3>
    <p>${esc(d.get("nombre"))} · ${esc(d.get("celular"))}<br>${esc(d.get("direccion"))}, ${esc(d.get("distrito"))}</p>
    <h3 class="h6">Entrega y pago</h3>
    <p>${ETIQUETA[d.get("entrega")]} · ${ETIQUETA[d.get("pago")]} (pago simulado)</p>
    <dl class="resumen">${htmlResumen(r)}</dl>`;
}

// Continuar / Volver
$form.addEventListener("click", e => {
  const boton = e.target.closest("[data-ir]");
  if (!boton) return;
  if (boton.hasAttribute("data-validar") && !validarPaso(pasoActual)) return;
  mostrarPaso(Number(boton.dataset.ir));
});

// Solo el paso 3 confirma; Enter en los pasos 1 y 2 no envía el pedido
$form.addEventListener("submit", e => {
  e.preventDefault();
  if (pasoActual === 3) confirmar();
});

// Corrige el error apenas la persona lo arregla
$form.addEventListener("input", e => {
  const nombre = e.target.name;
  if (nombre && REGLAS[nombre] && e.target.getAttribute("aria-invalid") === "true") {
    const control = $form.elements[nombre];
    const r = REGLAS[nombre](control.value);
    if (r === true) {
      const nodos = control.tagName ? [control] : [...control];
      nodos.forEach(c => { c.classList.remove("is-invalid"); c.setAttribute("aria-invalid", "false"); });
      const err = document.getElementById("error-" + nombre);
      err.textContent = ""; err.classList.remove("d-block");
    }
  }
});

function confirmar() {
  const d = Object.fromEntries(new FormData($form));
  const r = resumenCarrito(d.entrega);
  const pedido = {
    numero: "PED-" + Date.now().toString(36).toUpperCase(),
    fecha: new Date().toISOString(),
    cliente: { nombre: d.nombre, celular: d.celular, direccion: d.direccion, distrito: d.distrito },
    entrega: d.entrega, pago: d.pago,
    items: carrito.items.map(i => ({ ...i })),
    montos: r
  };
  let historial = [];
  try { historial = JSON.parse(localStorage.getItem("pedidos")) ?? []; } catch (e) { historial = []; }
  try { localStorage.setItem("pedidos", JSON.stringify([...historial, pedido])); } catch (e) { console.warn("Sin almacenamiento"); }
  carrito.vaciar();                // el carrito se vacía al confirmar
  guardarCupon("");
  cambioCarrito();
  $form.hidden = true;
  const $res = document.getElementById("resultado");
  $res.innerHTML = `<div class="alert alert-success">
      <h2 class="h4" id="titulo-confirmacion" tabindex="-1">¡Gracias por tu compra!</h2>
      <p class="mb-1">Tu pedido <strong>${pedido.numero}</strong> fue registrado.</p>
      <p class="mb-0">Total: ${soles(r.total)}. Esta compra es una simulación: no se cobró nada.</p>
    </div>
    <a href="tienda.html" class="btn btn-primary">Seguir comprando</a>`;
  document.getElementById("titulo-confirmacion").focus();
}

document.addEventListener("DOMContentLoaded", () => {
  if (carrito.items.length === 0) {
    $form.hidden = true;
      document.getElementById("resultado").innerHTML =
      `<div class="alert alert-warning">Tu carrito está vacío. <a href="tienda.html" class="alert-link">Elige un celular en el catálogo</a> para continuar.</div>`;
  }
});
