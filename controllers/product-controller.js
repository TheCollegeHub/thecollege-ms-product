
import { Product , ProductV2} from "../models/product"
import Favorite from "../models/favorite-model";
import multer, { diskStorage } from "multer";
import { extname } from "path";


export async function getAllproducts(req, res) {
    let products = await Product.find({});
    console.log("All Products");
    res.send(products);
  };
  
  
  export async function getNewcollections(req, res) {
    let products = await Product.find({});
    let arr = products.slice(0).slice(-8);
    console.log("New Collections");
    res.send(arr);
  };
  
  
  export async function getPopularinwomen(req, res) {
    let products = await Product.find({ category: "women" });
    let arr = products.splice(0, 4);
    console.log("Popular In Women");
    res.send(arr);
  };
  
  
  
export async function getRelatedProducts(req, res) {
  console.log("Related Products");
  const {category} = req.body;
  const products = await Product.find({ category });
  const arr = products.slice(0, 4);
  res.send(arr);
};

export async function getProductsByIds(req, res){
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Invalid input, please provide an array of ids.' });
  }

  try {
      const products = await Product.find({ id: { $in: ids } });
      return res.status(200).json(products);
  } catch (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};


  
  
export async function addProduct(req, res) {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
      let last_product_array = products.slice(-1);
      let last_product = last_product_array[0];
      id = last_product.id + 1;
    }
    else { id = 1; }
    const product = new Product({
      id: id,
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
    });
    await product.save();
    console.log("Saved");
    res.json({ success: true, name: req.body.name })
  };
  
  
  export async function removeProduct(req, res) {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Removed");
    res.json({ success: true, name: req.body.name })
  };

  
  export async function getProductsV2(req, res) {
    try {
      const products = await ProductV2.find();
  
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving products', error });
    }
  };
  
  export async function getFavouriteProducts(req, res) {
    const productIds = req.body.productIds; 
  
    try {
      const products = await ProductV2.find({ _id: { $in: productIds } });
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  export async function getProductsByCategory(req, res) {
    const { categoryId, limit } = req.query;
    const limitInt = parseInt(limit, 10) || 4;

    console.log(categoryId)
  
    try {
      const products = await ProductV2.find({ categoryId }).limit(limitInt);
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  export async function seachProduct(req, res) {
    try {
      const { query, categoryId, brandId, minPrice, maxPrice } = req.query;
  
      let filter = {};
  
      if (query) {
        filter.title = { $regex: query, $options: 'i' }; 
      }
  
      if (categoryId) {
        filter.categoryId = categoryId;
      }
  
      if (brandId) {
        filter.sku = brandId;
      }
  
      if (minPrice) {
        filter.price = { ...filter.price, $gte: parseFloat(minPrice) };
      }
  
      if (maxPrice) {
        filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };
      }
  
      const products = await ProductV2.find(filter);
  
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ error: 'Error to searcg product' });
    }
  };

  
const storage = diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${extname(file.originalname)}`)
  }
})

const upload = multer({ storage: storage })

export async function uploadProduct(req, res) {
  res.json({
    success: 1,
    image_url: `/images/${req.file.filename}`
  })
}

export const toggleFavouriteProduct = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "userId e productId are required." });
    }

    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found." });
    }

    let favorite = await Favorite.findOne({ userId });

    if (!favorite) {
      favorite = new Favorite({ userId, products: [productId] });
      await favorite.save();
      return res.status(201).json({ message: "Product added to favorites.", favorites: favorite });
    }

    const isFavourite = favorite.products.some(id => id.toString()  === productId);

    if (isFavourite) {
      favorite.products = favorite.products.filter(id => id.toString()  !== productId);
    } else {
      favorite.products.push(productId);
    }

    await favorite.save();

    res.status(200).json({
      message: isFavourite ? "Produto removed from favorites." : "Product added to favorites.",
      favorites: favorite
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error to update favorites.", error: error.message });
  }
};

export const getUserFavorites = async (req, res) => {
  try {
    const { userId } = req.params;

    const favorite = await Favorite.findOne({ userId }).populate("products");

    if (!favorite) {
      return res.status(404).json({ message: "No favorite product found for the user" });
    }

    res.status(200).json(favorite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error to get favorites.", error: error.message });
  }
};