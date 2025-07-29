import express from "express";
import http from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import dotenv from "dotenv";
import viewsRouter from "./routes/views.router.js";
import connectMongoDB from "./config/db.js";
import ProductManager from "./ProductManager.js";
import CartManager from "./CartManager.js";
import productsRouter from "./routes/products.router.js";

// inicializa las variables de entorno 
dotenv.config();
const PORT = process.env.PORT || 8080; // puerto por defecto 8080

const app = express();
app.use(express.static("public"));
const server = http.createServer(app);

// configuramos para que nuestro server acepte solicitudes websockets
const io = new Server(server); // io es Input Output

// configuramos handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars"); // el motor por defecto
app.set("views", "./src/views");

app.use(express.json()); // recibir json 

connectMongoDB();

const productManager = new ProductManager("./src/products.json");
const cartManager = new CartManager("./src/carts.json");

app.use("/", viewsRouter);


app.use("/api/products", productsRouter);

//rutas o endpoints carts

app.post("/api/carts", async (req, res) => {
  try {
    const carts = await cartManager.addCart();
    res.status(201).json({ status: "success", carts });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al agregar el producto" });
  }
});

app.post("/api/carts/:cid/product/:pid", async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    const quantity = parseInt(req.body.quantity);
    const carts = await cartManager.addProductInCartById(cid, pid, quantity);
    res.status(201).json({ status: "success", carts });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al agregar el producto" });
  }
});

app.get("/api/carts/:cid", async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    const carts = await cartManager.getProductsInCartById(cid);
    res.status(201).json({ status: "success", products: carts });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al agregar el producto" });
  }
});


// websockets lado del servidor
io.on("connection", (socket) => {
  console.log("Nuevo usuario conectado");
  socket.on("newProduct", async (productData) => {
    // añadir nuevo producto 
    try {
      await productManager.addProduct(productData);
      const totalProducts = await productManager.getProducts(); 
      io.emit("productAdded", totalProducts);
    } catch (error) {
      console.error("Error al incluir producto");
    }
  });
  socket.on("deleteProduct", async (productId) => {
    try {
      await productManager.deleteProductById(productId);
      const updatedProducts = await productManager.getProducts();
      io.emit("updateProductsList", updatedProducts);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
    });
});

// cambia a server
server.listen(PORT, () => {
  console.log("Servidor iniciado en el puerto 8080");
});