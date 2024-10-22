import mongoose from 'mongoose';
import { Product } from '../models/product'; 
const uri = process.env.MONGO_URL || 'mongodb://localhost:27017';

mongoose.connect(`${uri}/thecollegestore?`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Database connection established successfully'))
  .catch(err => console.error('Error connecting to the database:', err));

export async function checkStock(productIds) {
  if (!Product) {
    console.error('Product Modal is not defined');
    return [];
  }

  try {
    const products = await Product.find({ id: { $in: productIds } });

    console.log(products);
    const productsOutOfStock = products
      .filter(product => product.stock <= 0)
      .map(product => ({
        id: product.id,
        name: product.name,
      }));

    return productsOutOfStock;
  } catch (error) {
    console.error('Error to check the stock:', error);
    return [];
  }
}

export async function updateProductStock(productId, quantity) {
  if (!Product) {
    console.error('Modelo Product is not defined.');
    return;
  }

  try {
    await Product.updateOne(
      { id: productId },
      { $inc: { stock: -quantity } } 
    );
    console.log(`Stock of product ${productId} updated with success.`);
  } catch (error) {
    console.error(`Error to updated the stock of product ${productId}:`, error);
  }
}