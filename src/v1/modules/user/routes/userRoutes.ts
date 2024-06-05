import express from 'express';
import { registerUserController, loginUserController, getAllUserController, deleteUserController, updateUserController, logoutUserController, refreshTokenController } from '../controller/userController';
import { isAuthenticated } from '../../../middleware/authMiddlewares';

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


export default router;