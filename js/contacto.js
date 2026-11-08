// R9 · Validación con JavaScript (novalidate en el HTML)
const reglas = {
  nombre: v => v.trim().length >= 3 ? '' : 'Escribe al menos 3 letras.',
  correo: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Correo no válido.',
  telefono: v => /^9\d{8}$/.test(v.trim()) ? '' : 'Debe tener 9 dígitos y empezar con 9.',
  mensaje: v => v.trim().length >= 10 ? '' : 'Escribe al menos 10 caracteres.'
};

function validar(campo) {
  const error = reglas[campo.name](campo.value);
  document.getElementById('err-' + campo.name).textContent = error;
  campo.setAttribute('aria-invalid', error ? 'true' : 'false');
  return !error;
}

const form = document.getElementById('form');
const campos = [...form.querySelectorAll('input, textarea')];

campos.forEach(c => c.addEventListener('blur', () => validar(c)));   // evento blur

form.addEventListener('submit', e => {
  e.preventDefault();
  const validos = campos.map(validar);
  const exito = document.getElementById('exito');
  if (validos.includes(false)) {
    exito.textContent = '';
    campos[validos.indexOf(false)].focus();
    return;
  }
  exito.textContent = '¡Gracias, ' + form.nombre.value.trim() + '! Recibimos tu mensaje.';
  form.reset();
  campos.forEach(c => c.removeAttribute('aria-invalid'));
});
