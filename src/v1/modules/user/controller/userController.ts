import express from "express";
import { createUser, deleteUserById, getUsers, getUserByEmail, getUserById, getUserByPhone, updateUserById } from "./userHelper";
import { comparePasswords, encryptPassword } from "../../../../utils/encryptDecrypt";
import jwt from "jsonwebtoken"
import "../../../../common/appConstants"
import {printConsoleLog, printConsoleLogs} from "../../../../utils/printConsoleLog"
import { appCookieConst } from "../../../../common/appConstants";

// REGISTER NEW USER. ========================================
export const registerUserController = async (req: express.Request, res: express.Response) => {
  try {
    // validate here and if error then return
    const { fullName, email, userPhoneNumber, password, gender } = req.body;
    if (!fullName || !email || !password || !userPhoneNumber) {
      return res.status(400).send({ message: "Please fill all details", success: false });
    }

    // check if user already exists on email
    const existingEmailUser = await getUserByEmail(email);
    if (existingEmailUser) {
      return res.status(400).send({ message: "Email already exists", success: false });
    }

    // check if user already exists on phone
    const existingPhoneNumberUser = await getUserByPhone(userPhoneNumber);
    if (existingPhoneNumberUser) {
      return res.status(400).send({ message: "Phone number already exists", success: false });
    }

    // encrypt password
    const hashedPassword = await encryptPassword(req.body.password);

    const newUser = await createUser({
      fullName,
      email,
      userPhoneNumber,
      authentication: {
        password: hashedPassword,
      },
      gender,
    });
    
    return res.status(200).json(newUser).end
  } catch (error) {
    printConsoleLog(error)
    if (error.name === "ValidationError") {
      // Handle mongoose validation errors
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).send({ message: messages.join(", "), success: false });
    } else if (error.code === 11000) {
      // Handle unique constraint errors
      const field = Object.keys(error.keyPattern)[0];
      return res
        .status(400)
        .send({
          message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
          success: false,
        });
    } else {
      return res.status(500).send({ message: "Unable to register", success: false });
    }
  }
};

// LOGIN USER  ========================================
export const loginUserController = async (req: express.Request, res: express.Response) => {
  try {
    const {email, password} = req.body;
    if(!email || !password){
      return res.status(400).send({ message: "Incorrect Email or Password", success: false });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(400).send({ message: "User not found !", success: false });
    }
    const isMatch = await comparePasswords(password, user.authentication.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Invalid Email or password", success: false });
    }
    // TODO: check how token expiration work
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    user.authentication.sessionToken = token
    await user.save();
    res.cookie(appCookieConst, user.authentication.sessionToken, {domain:'localhost', path: '/'})
    return res.status(200).send({ message: "Login Success", success: true, data: user, token });
  } catch(error) {
    printConsoleLogs("==========",error, "==========", `${"some"}`)
    return res.status(500).send({ message: "Unable to login", success: false });
  }
}


// LOGOUT USER ========================================
export const logoutUserController = async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params;
    const user = await getUserById(userId);
    if (!user) {
      return res.status(400).send({ message: "User not found", success: false });
    }
    user.authentication.sessionToken = null;
    await user.save();
    res.clearCookie(appCookieConst);
    return res.status(200).send({ message: "Logout successful", success: true });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res.status(500).send({ message: "Failed to logout user", success: false });
  }
}


// REFRESH TOKEN ========================================
export const refreshTokenController = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    if (!user) {
      return res.status(400).send({ message: "User not found", success: false });
    }
    // Generate new token
    const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    
    user.authentication.sessionToken = newToken;
    await user.save();
    // Update the session token in the client's cookies
    res.cookie(appCookieConst, newToken, { domain: 'localhost', path: '/' });
    return res.status(200).send({ message: "Token refreshed", success: true, user, newToken });

  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(500).send({ message: "Failed to refresh token", success: false });
  }
}


// GET ALL USERs  ========================================
export const getAllUserController = async (req: express.Request, res: express.Response) => {
  try {
    const users = await getUsers();
    return res.status(200).send({ message: "Users fetched", success: true, data: users });
  } catch(error) {
    printConsoleLogs("==========",error, "==========", `${"some"}`)
    return res.status(500).send({ message: "Unable to fetch users", success: false });
  }
}


// DELETE USER  ========================================
export const deleteUserController = async (req: express.Request, res: express.Response) => {
  try {
    const {id} = req.params;
    if(!id){
      return res.status(400).send({ message: "User not found !", success: false });
    }
    const deletedUser = await deleteUserById(id);
    return res.status(200).send({ message: "User deleted", success: true, data: deletedUser });
  } catch(error) {
    printConsoleLogs("==========",error, "==========", `${"some"}`)
    return res.status(500).send({ message: "Failed to delete user", success: false });
  }
}

// UPDATE USER  ========================================
export const updateUserController = async (req: express.Request, res: express.Response) => {
  try {
    const {id} = req.params;
    printConsoleLog(id)
    if(!id){
      return res.status(400).send({ message: "User not found !", success: false });
    }
    const user = await getUserById(id);
    if(!id){
      return res.status(400).send({ message: "User not found !", success: false });
    }

    // Extract fields to be updated from req.body
    const { fullName, email, userPhoneNumber, gender, profilePicture } = req.body;

    // Merge updated fields with existing user object
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (userPhoneNumber) user.userPhoneNumber = userPhoneNumber;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = profilePicture;

    // Update user
    await updateUserById(user.id, user);

    // Fetch and return the updated user
    const updatedUser = await getUserById(id);
    
    return res.status(200).send({ message: "User updated", success: true, data: updatedUser });
  } catch(error) {
    printConsoleLogs("==========",error, "==========", `${"some"}`)
    return res.status(500).send({ message: "Failed to update user", success: false });
  }
}