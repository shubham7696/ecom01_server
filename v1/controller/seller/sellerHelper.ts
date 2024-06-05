import mongoose from "mongoose";
import { SellerSchema } from "../../models/sellers/sellers";

export const SellerModel = mongoose.model("Sellers", SellerSchema);

// Get sellers from the database, including only the necessary fields
export const getSellers = () => SellerModel.find({}, { _id: 1, fullName: 1, email: 1, userPhoneNumber: 1, pan: 1, gender: 1, profilePicture: 1, panPicture: 1, store: 1, __v: 1 });
export const getSellerByEmail = (email: String) => SellerModel.findOne({ email });
export const getSellerByPhone = (userPhoneNumber: String) => SellerModel.findOne({ userPhoneNumber });
export const getSellerByPan = (pan: String) => SellerModel.findOne({ pan });
export const getSellerBySessionToken = (sessionToken: String) => SellerModel.findOne({ 'authentication.sessionToken': sessionToken });
export const getSellerById = (id: String) => SellerModel.findById({ _id: id });

// Create new seller
export const createSeller = (values: Record<string, any>) => new SellerModel(values).save().then((seller) => seller.toObject());

// Delete seller
export const deleteSellerById = (id: String) => SellerModel.findOneAndDelete({ _id: id });

// Update seller
export const updateSellerById = (id: String, values: Record<string, any>) => SellerModel.findByIdAndUpdate({ _id: id }, values, { new: true });
