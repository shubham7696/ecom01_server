import express from 'express';
import { addStoreController, deleteStoreController, getAllStoresController, getSellerStoresController, getStoreByIdController, updateStoreController } from '../controller/storeController';
import { isStoreOwnership } from '../../../middleware/sellerAuthMiddleware';

// router object
const router = express.Router();

// Get all stores || GET
router.get('/allStores', getAllStoresController);

// Get stores of a specific seller || GET
router.get('/:sellerId/stores', getSellerStoresController);

// Get store by ID
router.get('/store/:storeId', getStoreByIdController);

// Add new store
router.post('/:sellerId/store', addStoreController);

// Update store by ID
router.patch('/store/:storeId', isStoreOwnership, updateStoreController);
// router.patch('/store/:storeId', updateStoreController);

// Delete store by ID
// router.delete('/:storeId', isStoreOwnership, deleteStoreController);
router.delete('/:storeId', deleteStoreController);

export default router;