# Backend I
Componentes principales
* Express.js( express) : Este es el framework de aplicaciones web utilizado para crear la API.
* ProductManager Esta clase (importada de ./ProductManager.js) se encarga de todas las operaciones relacionadas con los productos. Interactúa con un archivo JSON llamado products.json(ubicado en el ./srcdirectorio) para almacenar y recuperar datos de los productos.
* CartManagerDe forma similar, esta clase (importada de ./CartManager.js) gestiona todas las operaciones relacionadas con los carritos de compra. Gestiona los datos del carrito en un carts.jsonarchivo (también en ./src).
* app.use(express.json()):Esta línea configura el middleware en Express que analiza automáticamente las cargas JSON entrantes de las solicitudes del cliente, haciéndolas accesibles.
