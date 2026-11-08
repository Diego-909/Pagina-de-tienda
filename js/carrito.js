const lineas = document.getElementById('lineas');
const totales = document.getElementById('totales');
const msgCupon = document.getElementById('msg-cupon');
const inputCupon = document.getElementById('cupon');

function mostrar() {
  const items = carrito.detalle();
  document.getElementById('vacio').hidden = items.length > 0;
  document.getElementById('lleno').hidden = items.length === 0;

  lineas.innerHTML = items.map(({ producto: p, cantidad }) => `<tr>
    <td>${p.nombre}</td>
    <td>${soles(p.precio)}</td>
    <td><button data-accion="restar" data-id="${p.id}" aria-label="Quitar una unidad">−</button>
        ${cantidad}
        <button data-accion="sumar" data-id="${p.id}" aria-label="Agregar una unidad">+</button></td>
    <td>${soles(calcularSubtotal(p.precio, cantidad))}</td>
    <td><button data-accion="quitar" data-id="${p.id}" aria-label="Eliminar">✕</button></td>
  </tr>`).join('');

  const r = calcularResumen(items, carrito.cupon);
  totales.innerHTML = `
    <div class="fila"><span>Subtotal</span><span>${soles(r.subtotal)}</span></div>
    <div class="fila"><span>Descuento ${carrito.cupon}</span><span>− ${soles(r.descuento)}</span></div>
    <div class="fila"><span>IGV (incluido)</span><span>${soles(r.igv)}</span></div>
    <div class="fila"><span>Envío</span><span>${r.envio ? soles(r.envio) : 'Gratis'}</span></div>
    <div class="fila total"><span>Total</span><span>${soles(r.total)}</span></div>`;
}

lineas.addEventListener('click', e => {
  const boton = e.target.closest('button');
  if (!boton) return;
  const id = Number(boton.dataset.id);
  if (boton.dataset.accion === 'sumar') carrito.cambiar(id, 1);
  if (boton.dataset.accion === 'restar') carrito.cambiar(id, -1);
  if (boton.dataset.accion === 'quitar') carrito.quitar(id);
  mostrar();
});

document.getElementById('form-cupon').addEventListener('submit', e => {   // evento submit
  e.preventDefault();
  msgCupon.textContent = carrito.poner(inputCupon.value) ? 'Cupón aplicado.' : 'Cupón no válido.';
  mostrar();
});

document.getElementById('vaciar').addEventListener('click', () => {
  carrito.vaciar();
  msgCupon.textContent = '';
  mostrar();
});

document.addEventListener('DOMContentLoaded', () => {
  inputCupon.value = carrito.cupon;
  mostrar();
});
