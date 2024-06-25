import express from "express";
import { comparePasswords, encryptPassword } from "../../../../../utils/encryptDecrypt";
import jwt from "jsonwebtoken";
import { printConsoleLogs } from "../../../../../utils/printConsoleLog";
import { appCookieConst } from "../../../../../common/appConstants";
import {
  createSeller,
  getSellerByEmail,
  getSellerByEmailOrPhone,
  getSellerById,
  getSellerByPan,
  getSellerByPhone,
  getSellers,
} from "./sellerHelper";

// // FIND BEFORE REGISTER NEW SELLER ========================================
// export const findSellerController = async (req: express.Request, res: express.Response) => {
//   try {
//     const { email, userPhoneNumber, pan } = req.body;
//     const { seller, matchedField } = await getSellerByFields({ email, userPhoneNumber, pan });

//     if (!seller) {
//       return registerSellerController(req,res)
//     }

//     return res.status(200).send({ message: `${matchedField} is already registered`, success: true, data: seller });
//   } catch (error) {
//     console.error("Error finding seller:", error);
//     return res.status(500).send({ message: "Failed to find seller", success: false });
//   }
// };

// REGISTER NEW SELLER ========================================
export const registerSellerController = async (req: express.Request, res: express.Response) => {
  try {
    const {
      fullName,
      email,
      userPhoneNumber,
      pan,
      password,
      gender,
      bankDetails,
      profilePicture,
      panPicture,
    } = req.body;

    if (!fullName || !email || !password || !userPhoneNumber || !pan) {
      return res.status(400).send({ message: "Please fill all mandatory details", success: false });
    }

    const existingEmailSeller = await getSellerByEmail(email);
    if (existingEmailSeller) {
      return res.status(400).send({ message: "Email already exists", success: false });
    }

    const existingPhoneSeller = await getSellerByPhone(userPhoneNumber);
    if (existingPhoneSeller) {
      return res.status(400).send({ message: "Phone number already exists", success: false });
    }

    const existingPanSeller = await getSellerByPan(pan);
    if (existingPanSeller) {
      return res.status(400).send({ message: "PAN already exists", success: false });
    }

    const hashedPassword = await encryptPassword(password);

    const newSeller = await createSeller({
      fullName,
      email,
      userPhoneNumber,
      pan,
      gender,
      bankDetails,
      profilePicture,
      panPicture,
      authentication: { password: hashedPassword },
    });

    return res.status(200).send({ message: "New Seller added", success: true, seller: newSeller });
  } catch (error) {
    printConsoleLogs(error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).send({ message: messages.join(", "), success: false });
    } else if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).send({
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
        success: false,
      });
    } else {
      return res.status(500).send({ message: "Unable to register seller", success: false });
    }
  }
};

// // LOGIN SELLER ========================================
export const loginSellerController = async (req: express.Request, res: express.Response) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).send({ message: "Incorrect Email/Phone or Password", success: false });
    }

    const seller = await getSellerByEmailOrPhone(emailOrPhone).select("+authentication.password");
    if (!seller) {
      return res.status(400).send({ message: "Seller not found!", success: false });
    }

    const isMatch = await comparePasswords(password, seller.authentication.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Invalid password", success: false });
    }

    const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    seller.authentication.sessionToken = token;
    await seller.save();

    res.cookie(appCookieConst, seller.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });
    return res.status(200).send({ message: "Login Success", success: true, data: seller, token });
  } catch (error) {
    printConsoleLogs("==========", error, "==========", "some");
    return res.status(500).send({ message: "Unable to login seller", success: false });
  }
};

// LOGOUT SELLER ========================================
export const logoutSellerController = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const seller = await getSellerById(id);
    if (!seller) {
      return res.status(400).send({ message: "Seller not found", success: false });
    }

    seller.authentication.sessionToken = null;
    await seller.save();
    res.clearCookie(appCookieConst);

    return res.status(200).send({ message: "Logout successful", success: true });
  } catch (error) {
    console.error("Error logging out seller:", error);
    return res.status(500).send({ message: "Failed to logout seller", success: false });
  }
};

// // REFRESH TOKEN ========================================
export const refreshSellerTokenController = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const seller = await getSellerById(id);
    if (!seller) {
      return res.status(400).send({ message: "Seller not found", success: false });
    }

    const newToken = jwt.sign({ id: seller._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    seller.authentication.sessionToken = newToken;
    await seller.save();

    res.cookie(appCookieConst, newToken, { domain: "localhost", path: "/" });
    return res.status(200).send({ message: "Token refreshed", success: true, seller, newToken });
  } catch (error) {
    printConsoleLogs("Error refreshing token:", error);
    return res.status(500).send({ message: "Failed to refresh token", success: false });
  }
};

// GET ALL SELLERs  ========================================
export const getAllSellerController = async (req: express.Request, res: express.Response) => {
  try {
    const sellers = await getSellers();
    printConsoleLogs("Here=====");
    return res.status(200).send({ message: "Sellers fetched", success: true, data: sellers });
  } catch (error) {
    printConsoleLogs("==========", error, "==========", `${"some"}`);
    return res.status(500).send({ message: "Unable to fetch Sellers", success: false });
  }
};

// UPDATE SELLER ========================================
export const updateSellerController = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({ message: "Invalid Seller ID!", success: false });
    }

    const seller = await getSellerById(id);
    if (!seller) {
      return res.status(400).send({ message: "Seller not found!", success: false });
    }

    const { fullName, email, userPhoneNumber, gender, bankDetails, profilePicture, panPicture } =
      req.body;

    // Check if the new userPhoneNumber is the same as the current one
    if (userPhoneNumber !== seller.userPhoneNumber) {
      // Check if the new userPhoneNumber already exists in the database
      const existingSeller = await getSellerByPhone(userPhoneNumber);
      if (existingSeller && existingSeller._id.toString() !== id) {
        // If it exists and belongs to a different seller, throw an error
        return res
          .status(400)
          .send({ message: "User phone number already exists", success: false });
      }
    }

    if (fullName) seller.fullName = fullName;
    if (email) seller.email = email;
    if (userPhoneNumber) seller.userPhoneNumber = userPhoneNumber;
    if (gender) seller.gender = gender;
    if (bankDetails) seller.bankDetails = bankDetails;
    if (profilePicture) seller.profilePicture = profilePicture;
    if (panPicture) seller.panPicture = panPicture;

    await seller.save();

    const updatedSeller = await getSellerById(id);

    return res.status(200).send({ message: "Seller updated", success: true, data: updatedSeller });
  } catch (error) {
    printConsoleLogs("==========", error, "==========", "some");
    return res.status(500).send({ message: "Failed to update seller", success: false });
  }
};
