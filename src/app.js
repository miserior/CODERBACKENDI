import express from "express";
import http from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./ProductManager.js";
import CartManager from "./CartManager.js";

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

const productManager = new ProductManager("./src/products.json");
const cartManager = new CartManager("./src/carts.json");

app.use("/", viewsRouter);


app.get("/api/products", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.status(200).json({ status: "success", products });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al obtener los productos" });
  }
});

app.get("/api/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const products = await productManager.getProductById(pid);
    res.status(200).json({ status: "success", products });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al obtener los productos" });
  }
});

app.delete("/api/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const products = await productManager.deleteProductById(pid);
    res.status(200).json({ status: "success", products });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al borrar el producto" });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const newProduct = req.body;
    const products = await productManager.addProduct(newProduct);
    res.status(201).json({ status: "success", products });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al agregar el producto" });
  }
});

app.put("/api/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const updatedData = req.body;

    const products = await productManager.updateProductById(pid, updatedData);
    res.status(200).json({ status: "success", products });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al editar el producto" });
  }
});

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
server.listen(8080, () => {
  console.log("Servidor iniciado en el puerto 8080");
});