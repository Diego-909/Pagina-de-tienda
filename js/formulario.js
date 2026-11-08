// Formulario de contacto con validación en JavaScript.
const form = document.getElementById("form-contacto");
const mensaje = document.getElementById("mensaje");
const contadorMensaje = document.getElementById("contador-mensaje");

const reglas = {
  nombre: v => v.trim().length >= 3 || "Escribe tu nombre completo (mínimo 3 letras).",
  correo: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Escribe un correo válido, por ejemplo ana@correo.com.",
  telefono: v => /^9\d{8}$/.test(v) || "El celular debe tener 9 dígitos y empezar con 9.",
  mensaje: v => v.trim().length >= 10 || "Cuéntanos tu consulta en al menos 10 caracteres."
};

function validarCampo(campo) {
  const resultado = reglas[campo.name](campo.value);
  const error = document.getElementById("error-" + campo.name);
  const valido = resultado === true;
  campo.setAttribute("aria-invalid", !valido);
  error.textContent = valido ? "" : resultado;
  return valido;
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const resultados = [...form.querySelectorAll("[name]")].map(validarCampo);
  const exito = document.getElementById("exito");
  if (resultados.every(Boolean)) {
    exito.textContent = "Mensaje enviado. Te responderemos en menos de 24 horas.";
    form.reset();
    contadorMensaje.textContent = "0 / 300";
  } else {
    exito.textContent = "";
    form.querySelector("[aria-invalid='true']").focus();
  }
});
form.addEventListener("input", e => {
  if (e.target.getAttribute("aria-invalid") === "true") validarCampo(e.target);
});
mensaje.addEventListener("keydown", () => {
  setTimeout(() => { contadorMensaje.textContent = `${mensaje.value.length} / 300`; }, 0);
});
document.addEventListener("DOMContentLoaded", () => { contadorMensaje.textContent = "0 / 300"; });
