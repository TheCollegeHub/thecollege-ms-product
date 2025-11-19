import express from "express";
import { addProduct, getAllproducts, getFavouriteProducts, getNewcollections, getPopularinwomen, 
    getProductsByCategory, getProductsV2, getRelatedProducts, removeProduct, seachProduct, 
    uploadProduct, toggleFavouriteProduct, getUserFavorites } from "../controllers/product-controller";
const router = express.Router();

router.get('/allproducts', getAllproducts);
router.get('/newcollections', getNewcollections);
router.get('/popularinwomen', getPopularinwomen);
router.post('/relatedproducts', getRelatedProducts);
router.post('/addproduct', addProduct);
router.post('/removeproduct', removeProduct);
router.get('/v2/products', getProductsV2);
router.post('/v2/products/favourites', getFavouriteProducts);
router.post('/v2/favorites/toggle', toggleFavouriteProduct);
router.get('/v2/favorites/:userId', getUserFavorites);
router.get('/v2/products/category', getProductsByCategory);
router.get('/v1/products/search', seachProduct);
router.get('/upload', uploadProduct);



export default router;

