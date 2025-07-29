import { create } from "express-handlebars";
import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
    title: String,
    description: {type: String, index: "text"},// agregar indice
    code: {type: String, unique: true},
    price: Number,
    status: {type: Boolean, default: true},
    stock: Number,
    category: {type: String, index: true},
    thumbnails: {type: String, default: ""},
    createdAt: { type: Date, default: Date.now() }
});

productSchema.plugin(paginate); // Agregar plugin de paginación

const Product = mongoose.model("Product", productSchema);
export default Product;