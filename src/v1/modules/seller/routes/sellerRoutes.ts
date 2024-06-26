import express from "express";
import {
  registerSellerController,
  loginSellerController,
  getAllSellerController,
  logoutSellerController,
  refreshSellerTokenController,
  updateSellerController,
} from "../controller/seller/sellerController";
import { isSellerAuthenticated } from "../../../middleware/sellerAuthMiddleware";

// router object
const router = express.Router();

//routes
// REGISTER || POST
router.post("/register", registerSellerController);

// LOGIN || POST
router.post("/login", loginSellerController);

// GET ALL USERS || GET
router.get("/allSellers", isSellerAuthenticated, getAllSellerController);

// DELETE USER || DEL
// router.delete("/deleteUser/:id", deleteUserController);
// router.delete("/deleteUser/:id", isAuthenticated, isOwner, deleteUserController); // need to implement cookies for this

// UPDATE USER || PATCH
router.patch("/updateSeller/:id", updateSellerController);

// REFRESH USER TOKEN || PATCH
router.patch("/refreshSellerToken/:id", refreshSellerTokenController);

// LOGOUT USER || PATCH
router.patch("/logoutSeller/:id", logoutSellerController);

export default router;
