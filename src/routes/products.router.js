import express from 'express';
import Product from '../models/product.model.js';

const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1} = req.query;
    const data = await Product.paginate({}, {limit, page});
    const products = data.docs;
    delete data.docs;
    res.status(200).json({ status: 'success', payload: products, ...data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener los productos' });
  }
});


productsRouter.post("/", async (req, res) => {
  try {
    const {title, description, code, price, stock, category, thumbnails} = req.body;
    const product = new Product({title, description, code, price, stock, category, thumbnails});
    await product.save();
    res.status(201).json({ status: 'success', payload: product });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al agregar el producto" });
  }
});

productsRouter.put("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const updatedData = req.body;

    const products = await Product.findByIdAndUpdate(pid, updatedData, { new: true, runValidators: true}); // la nueva opción devuelve el documento actualizado
    if (!products) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }
    res.status(200).json({ status: "success", payload: products});
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al editar el producto" });
  }
});

productsRouter.get("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const products = await Product.findById(pid);
    if (!products) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }
    res.status(200).json({ status: "success", payload: products});
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al obtener los productos" });
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const products = await Product.findByIdAndDelete(pid);
    if (!products) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }
    res.status(200).json({ status: "success", payload: products});
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al borrar el producto" });
  }
});

export default productsRouter;