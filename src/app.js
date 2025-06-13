import express from "express";
import ProductManager from "./ProductManager.js";
import CartManager from "./CartManager.js";

const app = express();
app.use(express.json()); // recibir json 

const productManager = new ProductManager("./src/products.json");
const cartManager = new CartManager("./src/carts.json");

//rutas o endpoints products
app.get("/", (req, res)=> {
  res.json({ message: "Hola mundo" });
});

app.get("/api/products", async(req, res)=> {
  try {
    const products = await productManager.getProducts();
    res.status(200).json({ status: "success", products });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al obtener los productos" });
  }
});

app.get("/api/products/:pid", async(req, res)=> {
  try {
    const pid = req.params.pid;
    const products = await productManager.getProductById(pid);
    res.status(200).json({ status: "success", products });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al obtener los productos" });
  }
});

app.delete("/api/products/:pid", async(req, res)=> {
  try {
    const pid = req.params.pid;
    const products = await productManager.deleteProductById(pid);
    res.status(200).json({ status: "success", products });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al borrar el producto" });
  }
});

app.post("/api/products", async(req, res)=> {
  try {
    const newProduct = req.body;
    const products = await productManager.addProduct(newProduct);
    res.status(201).json({ status: "success", products });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al agregar el producto" });
  }
});

app.put("/api/products/:pid", async(req, res)=> {
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

app.post("/api/carts", async(req, res)=> {
  try {
    const carts = await cartManager.addCart();
    res.status(201).json({ status: "success", carts });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al agregar el producto" });
  }
});

app.post("/api/carts/:cid/product/:pid", async(req, res)=> {
  try {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    const quantity = parseInt(req.body.quantity);
    const carts = await cartManager.addProductInCartById(cid,pid,quantity);
    res.status(201).json({ status: "success", carts });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al agregar el producto" });
  }
});

app.get("/api/carts/:cid", async(req, res)=> {
  try {
    const cid = parseInt(req.params.cid);
    const carts = await cartManager.getProductsInCartById(cid);
    res.status(201).json({ status: "success", products: carts });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al agregar el producto" });
  }
});


app.listen(8080, ()=>{
  console.log("Servidor iniciado en el puerto 8080");
});