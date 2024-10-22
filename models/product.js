import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    stock: { type: Number, required: true },
});

export const Product = mongoose.model('Product', productSchema);
