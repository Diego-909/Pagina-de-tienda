
let carrito = [];

// Seleccionamos los elementos del HTML
const botones = document.querySelectorAll(".agregar-carrito");
const listaCarrito = document.querySelector("#lista-carrito tbody");
const totalHTML = document.querySelector("#total");
const vaciarCarrito = document.querySelector("#vaciar-carrito");

// Detectamos los clics en los botones
botones.forEach(boton => {

    boton.addEventListener("click", function(e) {

        e.preventDefault();

        // Obtenemos el contenedor del producto
        const producto = this.closest(".reciente-1, .box");

        // Obtenemos sus datos
        const nombre = producto.querySelector("h3").textContent;
        const precio = Number(producto.querySelector(".precio").textContent);
        const imagen = producto.querySelector("img").src;
        const id = this.getAttribute("data-id");

        // Comprobamos si el producto ya existe
        const existe = carrito.find(producto => producto.id === id);

        if (existe) {

            // Si existe, aumentamos su cantidad
            existe.cantidad++;

        } else {

            // Si no existe, creamos el producto
            const productoSeleccionado = {
                id: id,
                nombre: nombre,
                precio: precio,
                imagen: imagen,
                cantidad: 1
            };

            carrito.push(productoSeleccionado);
        }

        actualizarCarrito();

    });

});

// Actualizamos el carrito
function actualizarCarrito() {

    // Comprobamos que exista la tabla
    if (!listaCarrito || !totalHTML) return;

    // Limpiamos la tabla
    listaCarrito.innerHTML = "";

    let total = 0;

    // Recorremos los productos del carrito
    carrito.forEach(producto => {

        // Calculamos el precio según la cantidad
        const subtotal = producto.precio * producto.cantidad;

        total += subtotal;

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td><img src="${producto.imagen}" width="40" alt="${producto.nombre}"></td>
            <td>${producto.nombre}</td>
            <td>${producto.cantidad}</td>
            <td>S/ ${subtotal.toFixed(2)}</td>
        `;

        listaCarrito.appendChild(fila);

    });

    // Mostramos el total
    totalHTML.textContent = total.toFixed(2);

}

// Botón para vaciar el carrito
if (vaciarCarrito) {

    vaciarCarrito.addEventListener("click", function(e) {

        e.preventDefault();

        carrito = [];

        actualizarCarrito();

    });

}
