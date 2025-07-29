import express from "express";
import Cart from "../models/cart.model.js";

const cartsRouter = express.Router();

cartsRouter.post("/", async (req, res) => {
  try {
    const cart = new Cart();
    await cart.save();
    res.status(201).json({ status: "success", payload: cart });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error al crear el carrito" });
  }
});

cartsRouter.get("/", async (req, res) => {
  try {
    const cart = await Cart.find();
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Carritos no encontrados" });
    }
    res.status(201).json({ status: "success", payload: cart });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Error al traer los productos del carrito",
      });
  }
});

cartsRouter.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await Cart.findById(cid).populate("products.product"); // Poblamos la referencia al producto
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });
    }
    res.status(201).json({ status: "success", payload: cart.products });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error al traer los carritos" });
  }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = parseInt(req.body.quantity);
    const carts = await Cart.findByIdAndUpdate(
      cid,
      { $push: { products: { product: pid, quantity } } },
      { new: true }
    );
    res.status(200).json({ status: "success", payload: carts });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error al agregar el producto" });
  }
});

cartsRouter.delete("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await Cart.findByIdAndUpdate(
      cid,
      { $set: { products: [] } },
      { new: true } // Devuelve el documento actualizado
    );

    if (!cart) {
      return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
    }

    res.status(200)
    .json({status: "success",message: "Todos los productos del carrito se eliminaron.",payload: cart,
    });
  } catch (error) {
    res.status(500)
    .json({status: "error",message: "Error al eliminar los productos del carrito",
      });
  }
});

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findByIdAndUpdate(
      cid,
      { $pull: { products: { product: pid } } }, // Elimina del array de products
      { new: true } 
    );

    if (!cart) {
      return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
    }

    res.status(200).json({
      status: "success",
      message: "Producto eliminado del carrito",
      payload: cart,
    });
    
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al eliminar el producto del carrito" });
  }
});

export default cartsRouter;
