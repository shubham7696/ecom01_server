import express from "express";
import { createUser, getUsersByEmail, getUsersByPhone } from "./userHelper";
import { comparePasswords, encryptPassword } from "../../../utils/encryptDecrypt";
import jwt from "jsonwebtoken"
import {printConsoleLog, printConsoleLogs} from "../../../utils/printConsoleLog"

// REGISTER NEW USER. ========================================
export const registerUserController = async (req: express.Request, res: express.Response) => {
  try {
    // validate here and if error then return
    const { fullName, email, userPhoneNumber, password, gender } = req.body;
    if (!fullName || !email || !password || !userPhoneNumber) {
      return res.status(400).send({ message: "Please fill all details", success: false });
    }

    // check if user already exists on email
    const existingEmailUser = await getUsersByEmail(email);
    if (existingEmailUser) {
      return res.status(400).send({ message: "Email already exists", success: false });
    }

    // check if user already exists on phone
    const existingPhoneNumberUser = await getUsersByPhone(userPhoneNumber);
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

    const user = await getUsersByEmail(email);
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
    return res.status(200).send({ message: "Login Success", success: true, data: user, token });
  } catch(error) {
    printConsoleLogs("==========",error, "==========", `${"some"}`)
    return res.status(500).send({ message: "Unable to login", success: false });
  }
}