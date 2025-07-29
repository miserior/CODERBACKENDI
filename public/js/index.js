const socket = io();

const formNewProduct = document.getElementById("formNewProduct");

formNewProduct.addEventListener("submit", (event)=>{
    event.preventDefault();

    const formData = new FormData(formNewProduct); // ya va por defecto extraer datos del formulario
    const productData = {};
    formData.forEach((value, key)=>{
        productData[key] = value;
    });// formato 

    socket.emit("newProduct",productData); // emitamos los datos para el servidor
    formNewProduct.reset(); // limpiamos
});

socket.on("productAdded", (totalProducts)=> {
    const productsListContainer = document.getElementById('productsList');
    if (productsListContainer) {
        productsListContainer.innerHTML = '';
        console.log(totalProducts);
        totalProducts.forEach(product => {
            const productCardHtml = `
                <div class="card sectionc-cards col-lg-3 col-md-2 col-sm-12">
                    <div class="card-body">
                        <h3 class="card-title">${product.title}</h3>
                        <h4 class="card-title">${product.category}</h4>
                        <p class="card-text">${product.price} USD</p>
                        <button type="button" class="btn btn-danger delete-product-btn" data-id=${product._id}>Eliminar</button>
                    </div>
                </div>
            `;
            productsListContainer.insertAdjacentHTML('beforeend', productCardHtml);
        });
    }
});

document.addEventListener('click', (event) => {
    // Verificamos si el elemento clickeado tiene la clase 'delete-product-btn'
    if (event.target.classList.contains('delete-product-btn')) {
        const productId = event.target.dataset.id;
        if (productId) {
            socket.emit('deleteProduct', productId);
        }
    }
});

socket.on('updateProductsList', (products) => {
    const productsListContainer = document.getElementById('productsList');
    if (productsListContainer) {
        productsListContainer.innerHTML = '';
        products.forEach(product => {
            const productCardHtml = `
                <div class="card sectionc-cards col-lg-3 col-md-2 col-sm-12">
                    <div class="card-body">
                        <h3 class="card-title">${product.title}</h3>
                        <h4 class="card-title">${product.category}</h4>
                        <p class="card-text">${product.price} USD</p>
                        <button type="button" class="btn btn-danger delete-product-btn" data-id=${product.id}>Eliminar</button>
                    </div>
                </div>
            `;
            productsListContainer.insertAdjacentHTML('beforeend', productCardHtml);
        });
    }
});
