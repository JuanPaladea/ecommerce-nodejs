import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  shortDescription: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  tags: { type: [String], required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  isAvailable: { type: Boolean, required: true },
  images: { type: [String], required: true },
  },
  {
    timestamps: true
  }
);

const productsModel = mongoose.model("products", productsSchema);

export default productsModel;