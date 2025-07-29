import mongoose from "mongoose";
import Product from "../models/product.model.js";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.URI_MONGODB);
    await Product.syncIndexes(); // Sincronizar índices después de la conexión
    console.log("Conexión a MongoDB exitosa");
  } 
  catch (error) {
    console.error("Error al conectar a MongoDB:", error.message);
  }
}

export default connectMongoDB;