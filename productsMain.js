// Función para cargar productos desde el archivo JSON
function cargarProductos() {
    // Ruta al archivo JSON de productos
    const url = './products.json';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const productsContainer = document.getElementById('products-container');
            
            // Itera sobre los productos en el archivo JSON
            data.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');
                
                // Crea elementos HTML para mostrar la información del producto
                const img = document.createElement('img');
                img.src = product.imagen;
                img.alt = product.nombre;
                img.className = 'product__img';

                const descriptionDiv = document.createElement('div');
                descriptionDiv.classList.add('product__description');
                const title = document.createElement('h3');
                title.textContent = product.nombre;
                const price = document.createElement('span');
                price.textContent = `$ ${product.precio.toFixed(2)}`;

                // Agrega el ícono de carrito de compras con un enlace al carrito
                const cartLink = document.createElement('a');
                cartLink.href = 'carrito.html';
                cartLink.innerHTML = '<i class="fa-solid fa-cart-plus"></i>';

                // Agrega todos los elementos al productoDiv
                descriptionDiv.appendChild(title);
                descriptionDiv.appendChild(price);
                productDiv.appendChild(img);
                productDiv.appendChild(descriptionDiv);
                productDiv.appendChild(cartLink);

                // Agrega el productoDiv al contenedor de productos
                productsContainer.appendChild(productDiv);
            });
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
        });
}

// Llama a la función para cargar los productos cuando la página se carga completamente
window.addEventListener('load', cargarProductos);