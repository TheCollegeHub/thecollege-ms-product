import mongoose from 'mongoose';

import { model } from "mongoose";

export const Product = model("Product", {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    new_price: { type: Number },
    old_price: { type: Number },
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true },
    stock: { type: Number, required: true },
  });
  
export const ProductV2 = model('productsv2', {
  id: String,
  stock: Number,
  sku: String,
  price: Number,
  title: String,
  date: Date,
  salePrice: Number,
  thumbnail: String,
  categoryId: String,
  description: String,
  productType: String,
  images: [String],
});