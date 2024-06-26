import express from "express";
import {
  registerUserController,
  loginUserController,
  getAllUserController,
  deleteUserController,
  updateUserController,
  logoutUserController,
  refreshTokenController,
} from "../controller/userController";
import { isAuthenticated } from "../../../middleware/userAuthMiddlewares";
import {
  getNewlyAddedProductsController,
  getProductsByCategoryController,
  getProductsByDiscountController,
  getProductsByGenderController,
} from "../controller/products/productController";
import {
  addProductToCart,
  deleteCartItem,
  getCartItems,
  updateCartItemQuantity,
} from "../controller/carts/CartsController";

// router object
const router = express.Router();

//routes
// REGISTER || POST
router.post("/register", registerUserController);

// LOGIN || POST
router.post("/login", loginUserController);

// GET ALL USERS || GET
router.get("/allUsers", isAuthenticated, getAllUserController);
// router.get("/allUsers", isAuthenticated, getAllUserController); // need to implement cookies for this

// DELETE USER || DEL
router.delete("/deleteUser/:id", deleteUserController);
// router.delete("/deleteUser/:id", isAuthenticated, isOwner, deleteUserController); // need to implement cookies for this

// UPDATE USER || PATCH
router.patch("/updateUser/:id", updateUserController);

// REFRESH USER TOKEN || PATCH
router.patch("/refreshToken/:id", refreshTokenController);

// LOGOUT USER || PATCH
router.patch("/logoutUser/:id", logoutUserController);
// add middlewares

// User products routes
router.get("/products/newly-added", getNewlyAddedProductsController);
router.get("/products/discount", getProductsByDiscountController);
router.get("/products/category", getProductsByCategoryController);
router.get("/products/gender", getProductsByGenderController);


router.put("/cart/item", isAuthenticated, updateCartItemQuantity);
router.delete("/cart/item/:productId", isAuthenticated, deleteCartItem);
router.post("/cart", isAuthenticated, addProductToCart);
router.get("/cart", isAuthenticated, getCartItems);

export default router;
