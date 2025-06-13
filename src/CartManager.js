import fs from "fs";

class CartManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  generateNewId(carts) {
    if (carts.length > 0) {
      return carts[carts.length - 1].id + 1;
    } else {
      return 1;
    }
  }

  async addCart() {
    try {
      //recuperar la data
      const fileData = await fs.promises.readFile(this.pathFile, "utf-8");
      const carts = JSON.parse(fileData);

      const newId = this.generateNewId(carts);
      //editamos la data
      const cart = { id: newId, products: [] };
      carts.push(cart);

      //guardar en el archivo
      await fs.promises.writeFile(
        this.pathFile,
        JSON.stringify(carts, null, 2),
        "utf-8"
      ); // nuevo json
      return carts;
    } catch (error) {
      throw new Error("Error al añadir el producto - ", error.message);
    }
  }

  async addProductInCartById(idCart, idProduct, quantity) {
    try {
      //recuperar la data
      const fileData = await fs.promises.readFile(this.pathFile, "utf-8");
      const carts = JSON.parse(fileData);
      carts.forEach((cart) => {
        if (cart.id == idCart) {
          const existingProductIndex = cart.products.findIndex(
            (product) => product.id === idProduct
          );
          if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity;
          } else {
            cart.products.push({ id: idProduct, quantity });
          }
        }
      });
      await fs.promises.writeFile(
        this.pathFile,
        JSON.stringify(carts, null, 2),
        "utf-8"
      );
      return carts;
    } catch (error) {
      throw new Error("Error al traer el producto: ", error.message);
    }
  }

  //getProductById
  async getProductsInCartById(idCart) {
    try {
      //recuperar la data
      const fileData = await fs.promises.readFile(this.pathFile, "utf-8");
      const data = JSON.parse(fileData);
      const cart = data.find((cart) => cart.id === parseInt(idCart));
      return cart.products;
    } catch (error) {
      throw new Error("Error al traer el producto: ", error.message);
    }
  }
}

export default CartManager;
