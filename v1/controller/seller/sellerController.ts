import express from 'express';
import { comparePasswords, encryptPassword } from '../../../utils/encryptDecrypt';
import jwt from 'jsonwebtoken';
import '../../../common/appConstants';
import { printConsoleLog, printConsoleLogs } from '../../../utils/printConsoleLog';
import { appCookieConst } from '../../../common/appConstants';
import "./sellerHelper";

// REGISTER NEW SELLER ========================================
export const registerSellerController = async (req: express.Request, res: express.Response) => {
  try {
    const { fullName, email, userPhoneNumber, pan, password, gender, bankDetails, profilePicture, panPicture } = req.body;

    if (!fullName || !email || !password || !userPhoneNumber || !pan) {
      return res.status(400).send({ message: "Please fill all mandatory details", success: false });
    }

    const existingEmailSeller = await Seller.findOne({ email });
    if (existingEmailSeller) {
      return res.status(400).send({ message: "Email already exists", success: false });
    }

    const existingPhoneSeller = await Seller.findOne({ userPhoneNumber });
    if (existingPhoneSeller) {
      return res.status(400).send({ message: "Phone number already exists", success: false });
    }

    const existingPanSeller = await Seller.findOne({ pan });
    if (existingPanSeller) {
      return res.status(400).send({ message: "PAN already exists", success: false });
    }

    const hashedPassword = await encryptPassword(password);

    const newSeller = new Seller({
      fullName,
      email,
      userPhoneNumber,
      pan,
      gender,
      bankDetails,
      profilePicture,
      panPicture,
      authentication: { password: hashedPassword },
      store: {
        name: req.body.storeName,
        location: req.body.storeLocation,
        gstNumber: req.body.storeGstNumber,
        contactDetails: req.body.storeContactDetails,
        timing: req.body.storeTiming,
      },
    });

    await newSeller.save();

    return res.status(200).json(newSeller);
  } catch (error) {
    printConsoleLog(error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).send({ message: messages.join(", "), success: false });
    } else if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).send({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`, success: false });
    } else {
      return res.status(500).send({ message: "Unable to register seller", success: false });
    }
  }
};

// LOGIN SELLER ========================================
export const loginSellerController = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ message: "Incorrect Email or Password", success: false });
    }

    const seller = await Seller.findOne({ email }).select('+authentication.password');
    if (!seller) {
      return res.status(400).send({ message: "Seller not found!", success: false });
    }

    const isMatch = await comparePasswords(password, seller.authentication.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Invalid Email or password", success: false });
    }

    const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    seller.authentication.sessionToken = token;
    await seller.save();

    res.cookie(appCookieConst, seller.authentication.sessionToken, { domain: 'localhost', path: '/' });
    return res.status(200).send({ message: "Login Success", success: true, data: seller, token });
  } catch (error) {
    printConsoleLogs("==========", error, "==========", "some");
    return res.status(500).send({ message: "Unable to login seller", success: false });
  }
};

// LOGOUT SELLER ========================================
export const logoutSellerController = async (req: express.Request, res: express.Response) => {
  try {
    const { sellerId } = req.params;
    const seller = await Seller.findById(sellerId);
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

// REFRESH TOKEN ========================================
export const refreshTokenSellerController = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id);
    if (!seller) {
      return res.status(400).send({ message: "Seller not found", success: false });
    }

    const newToken = jwt.sign({ id: seller._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    seller.authentication.sessionToken = newToken;
    await seller.save();

    res.cookie(appCookieConst, newToken, { domain: 'localhost', path: '/' });
    return res.status(200).send({ message: "Token refreshed", success: true, seller, newToken });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(500).send({ message: "Failed to refresh token", success: false });
  }
};

// UPDATE SELLER ========================================
export const updateSellerController = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid Seller ID!", success: false });
    }

    const seller = await Seller.findById(id);
    if (!seller) {
      return res.status(400).send({ message: "Seller not found!", success: false });
    }

    const { fullName, email, userPhoneNumber, gender, bankDetails, profilePicture, panPicture, storeName, storeLocation, storeGstNumber, storeContactDetails, storeTiming } = req.body;

    if (fullName) seller.fullName = fullName;
    if (email) seller.email = email;
    if (userPhoneNumber) seller.userPhoneNumber = userPhoneNumber;
    if (gender) seller.gender = gender;
    if (bankDetails) seller.bankDetails = bankDetails;
    if (profilePicture) seller.profilePicture = profilePicture;
    if (panPicture) seller.panPicture = panPicture;

    if (storeName) seller.store.name = storeName;
    if (storeLocation) seller.store.location = storeLocation;
    if (storeGstNumber) seller.store.gstNumber = storeGstNumber;
    if (storeContactDetails) seller.store.contactDetails = storeContactDetails;
    if (storeTiming) seller.store.timing = storeTiming;

    await seller.save();

    const updatedSeller = await Seller.findById(id);

    return res.status(200).send({ message: "Seller updated", success: true, data: updatedSeller });
  } catch (error) {
    printConsoleLogs("==========", error, "==========", "some");
    return res.status(500).send({ message: "Failed to update seller", success: false });
  }
};

// ADD STORE ========================================
export const addStoreController = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id);
    if (!seller) {
      return res.status(400).send({ message: "Seller not found", success: false });
    }

    const { storeName, storeLocation, storeGstNumber, storeContactDetails, storeTiming } = req.body;

    if (!storeName || !storeLocation || !storeGstNumber || !storeContactDetails || !storeTiming) {
      return res.status(400).send({ message: "Please fill all store details", success: false });
    }

    seller.store = {
      name: storeName,
      location: storeLocation,
      gstNumber: storeGstNumber,
      contactDetails: storeContactDetails,
      timing: storeTiming,
    };

    await seller.save();

    return res.status(200).send({ message: "Store added", success: true, data: seller });
  } catch (error) {
    console.error("Error adding store:", error);
    return res.status(500).send({ message: "Failed to add store", success: false });
  }
};
