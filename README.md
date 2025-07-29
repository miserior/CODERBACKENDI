# Backend I
Componentes principales

## Nueva estructura de proyecto con persistencia en Mongo DB
* Express.js (express): Es el framework de aplicaciones web utilizado para construir la API y gestionar las rutas y peticiones HTTP.

* Mongoose: Es la biblioteca de modelado de datos de objetos (ODM) que se utiliza para conectarse e interactuar con una base de datos MongoDB. Reemplaza la gestión manual de archivos JSON, proporcionando una capa de abstracción para realizar operaciones CRUD.

* Modelo de Producto (Product): Este es un modelo de Mongoose que define el esquema (la estructura) de los datos de los productos. En lugar de una clase ProductManager, este modelo se encarga de todas las operaciones relacionadas con los productos directamente en la colección "products" de la base de datos MongoDB.

* Modelo de Carrito (Cart): De forma similar, este modelo de Mongoose define la estructura y gestiona todas las operaciones para los carritos de compra, interactuando directamente con la colección "carts" en MongoDB.

## Estructura inicial con persistencia en archivo
* Express.js( express) : Este es el framework de aplicaciones web utilizado para crear la API.
* ProductManager Esta clase (importada de ./ProductManager.js) se encarga de todas las operaciones relacionadas con los productos. Interactúa con un archivo JSON llamado products.json(ubicado en el ./srcdirectorio) para almacenar y recuperar datos de los productos.
* CartManagerDe forma similar, esta clase (importada de ./CartManager.js) gestiona todas las operaciones relacionadas con los carritos de compra. Gestiona los datos del carrito en un carts.jsonarchivo (también en ./src).
* app.use(express.json()):Esta línea configura el middleware en Express que analiza automáticamente las cargas JSON entrantes de las solicitudes del cliente, haciéndolas accesibles.
