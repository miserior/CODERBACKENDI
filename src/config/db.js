import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.URI_MONGODB);
    console.log("Conexión a MongoDB exitosa");
  } 
  catch (error) {
    console.error("Error al conectar a MongoDB:", error.message);
  }
}

export default connectMongoDB;