
document.addEventListener('DOMContentLoaded', async () => {
let baseDeDatos = [];
async function cargarBaseDeDatos() {
    const response = await fetch('./products.json');
        baseDeDatos = await response.json();
}
await cargarBaseDeDatos();
let carrito = [];
const divisa = '$';
const DOMitems = document.querySelector('#items');
const DOMcarrito = document.querySelector('#carrito');
const DOMtotal = document.querySelector('#total');
const DOMbotonVaciar = document.querySelector('#boton-vaciar');
const miLocalStorage = window.localStorage;

// Funciones
/**
* Dibuja todos los productos a partir de la base de datos. No confundir con el carrito
*/
async function renderizarProductos () {
    baseDeDatos.forEach((info) => {
        // Estructura
        const miPlato = document.createElement('div');
        miPlato.classList.add('card', 'col-sm-4');
        // Body
        const miPlatoCardBody = document.createElement('div');
        miPlatoCardBody.classList.add('card-body');
        // Titulo
        const miPlatoTitle = document.createElement('h5');
        miPlatoTitle.classList.add('card-title');
        miPlatoTitle.textContent = info.nombre;
        // Imagen
        const miPlatoImagen = document.createElement('img');
        miPlatoImagen.classList.add('img-fluid');
        miPlatoImagen.setAttribute('src', info.imagen);
        // Precio
        const miPlatoPrecio = document.createElement('p');
        miPlatoPrecio.classList.add('card-text');
        miPlatoPrecio.textContent = `${info.precio}${divisa}`;
        // Boton 
        const miPlatoBoton = document.createElement('button');
        miPlatoBoton.classList.add('btn', 'btn-primary');
        miPlatoBoton.textContent = '+';
        miPlatoBoton.setAttribute('marcador', info.id);
        miPlatoBoton.addEventListener('click', anyadirProductoAlCarrito);
        // Insertamos
        miPlatoCardBody.appendChild(miPlatoImagen);
        miPlatoCardBody.appendChild(miPlatoTitle);
        miPlatoCardBody.appendChild(miPlatoPrecio);
        miPlatoCardBody.appendChild(miPlatoBoton);
        miPlato.appendChild(miPlatoCardBody);
        DOMitems.appendChild(miPlato);
    });
}

/**
* Evento para añadir un producto al carrito de la compra
*/
function anyadirProductoAlCarrito(evento) {
    const boton = evento.target;
    const productoId = boton.getAttribute('marcador');
    console.log(productoId);
    // Aquí puedes realizar la lógica para agregar el producto al carrito
    
    // Luego, muestra una notificación con SweetAlert
    Swal.fire({
        icon: 'success',
        title: `Producto agregado: ${baseDeDatos[productoId-1].nombre}`,
        text: 'El producto ha sido agregado al carrito con éxito.',
        showConfirmButton: false, // No muestra el botón de "Aceptar"
        timer: 1500 // Cierra automáticamente después de 1.5 segundos
    });
    carrito.push(evento.target.getAttribute('marcador'))
    
    // Actualizamos el carrito 
    renderizarCarrito();

                // Actualizamos el LocalStorage
                guardarCarritoEnLocalStorage();
            }


            async function renderizarCarrito() {
                // Vaciamos todo el html
                DOMcarrito.textContent = '';
                // Quitamos los duplicados
                const carritoSinDuplicados = [...new Set(carrito)];
                // Inicializamos el total a 0
                let total = 0;
                carritoSinDuplicados.forEach((item) => {
                    // Obtenemos el item que necesitamos de la variable base de datos
                    const miItem = baseDeDatos.filter((itemBaseDatos) => {
                        // ¿Coincide las id? Solo puede existir un caso
                        return itemBaseDatos.id === parseInt(item);
                    });
                    // Cuenta el número de veces que se repite el producto
                    const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                        return itemId === item ? total += 1 : total;
                    }, 0);
                    // Calcula el subtotal para este producto
                    const subtotal = numeroUnidadesItem * miItem[0].precio;

                    // Suma el subtotal al total
                    total += subtotal;
                    // Creamos el nodo del item del carrito
                    const miPlato = document.createElement('li');
                    miPlato.classList.add('list-group-item', 'text-right', 'mx-2');
                    miPlato.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${subtotal.toFixed(2)}${divisa}`;
                    // Boton de borrar
                    const miBoton = document.createElement('button');
                    miBoton.classList.add('btn', 'btn-danger', 'mx-5');
                    miBoton.textContent = 'X';
                    miBoton.style.marginLeft = '1rem';
                    miBoton.dataset.item = item;
                    miBoton.addEventListener('click', borrarItemCarrito);
                    // Mezclamos
                    miPlato.appendChild(miBoton);
                    DOMcarrito.appendChild(miPlato);
                    });
                    // Renderizamos el precio total en el HTML
                    DOMtotal.textContent = `Total: ${total.toFixed(2)}${divisa}`;
                    }

                    /**
                    * Evento para borrar un elemento del carrito
                    */
                    function borrarItemCarrito(evento) {
                    // Obtenemos el producto ID que hay en el boton pulsado
                    const id = evento.target.dataset.item;
                    // Borramos todos los productos
                    carrito = carrito.filter((carritoId) => {
                    return carritoId !== id;
                    });
                    // volvemos a renderizar
                    renderizarCarrito();
                    // Actualizamos el LocalStorage
                    guardarCarritoEnLocalStorage();

}

/**


            /**
            * Varia el carrito y vuelve a dibujarlo
            */
            function vaciarCarrito() {
                // Limpiamos los productos guardados
                carrito = [];
                // Renderizamos los cambios
                renderizarCarrito();
                // Borra LocalStorage
                localStorage.clear();

            }
function guardarCarritoEnLocalStorage () {
    miLocalStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarritoDeLocalStorage () {
   
    if (miLocalStorage.getItem('carrito') !== null) {
        // Carga la información
        carrito = JSON.parse(miLocalStorage.getItem('carrito'));
    }
}

// Eventos
DOMbotonVaciar.addEventListener('click', vaciarCarrito);

// Inicio
cargarCarritoDeLocalStorage();
renderizarProductos();
renderizarCarrito();
});