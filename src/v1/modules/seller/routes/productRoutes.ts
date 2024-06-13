import express from 'express';
import { isProductOwnership } from '../../../middleware/sellerAuthMiddleware';
import {
  addNewProductController,
  getProductByIdController,
  getProductsController,
  getStoreProductsController,
} from "../controller/products/productController";

// router object
const router = express.Router();

// Get all PRODUCTS || GET
router.get('/allProducts', getProductsController);

// Get stores of a specific seller || GET
router.get("/:storeId/products", getStoreProductsController);

// Get product by ID
router.get("/:productId", getProductByIdController);

// Add new products
router.post("/addProduct", addNewProductController);

// Update store by ID
// router.patch('/store/:storeId', isStoreOwnership, updateStoreController);
// router.patch('/store/:storeId', updateStoreController);

// Delete store by ID
// router.delete('/:storeId', isStoreOwnership, deleteStoreController);
// router.delete('/:storeId', deleteStoreController);

export default router;