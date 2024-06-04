import express from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { registerUserController, loginUserController } from '../controller/user/userController';

// router object
const router = express.Router();

//routes
// REGISTER || POST
router.post("/register", registerUserController);

// LOGIN || POST
router.post("/login", loginUserController);


export default router;