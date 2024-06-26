import mongoose from "mongoose";
import { SellerModel } from "../../models/sellers";

// Get sellers from the database, including only the necessary fields
export const getSellers = () =>
  SellerModel.find(
    {},
    {
      _id: 1,
      fullName: 1,
      email: 1,
      userPhoneNumber: 1,
      pan: 1,
      gender: 1,
      profilePicture: 1,
      panPicture: 1,
      store: 1,
      __v: 1,
    }
  );
export const getSellerByEmail = (email: String) => SellerModel.findOne({ email });
export const getSellerByPhone = (userPhoneNumber: String) =>
  SellerModel.findOne({ userPhoneNumber });
export const getSellerByPan = (pan: String) => SellerModel.findOne({ pan });
export const getSellerBySessionToken = (sessionToken: String) =>
  SellerModel.findOne({ "authentication.sessionToken": sessionToken });
export const getSellerById = (id: String) => SellerModel.findById({ _id: id });

export const getSellerByEmailOrPhone = (emailOrPhone: string) => {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrPhone);
  if (isEmail) {
    return getSellerByEmail(emailOrPhone);
  } else {
    return getSellerByPhone(emailOrPhone);
  }
};

// Get seller by various fields
// export const getSellerByFields = (fields: { email: string; userPhoneNumber: string; pan: string; }) => {
//   const query = {};
//   if (fields.email) {
//     query.email = fields.email;
//   }
//   if (fields.userPhoneNumber) {
//     query.userPhoneNumber = fields.userPhoneNumber;
//   }
//   if (fields.pan) {
//     query.pan = fields.pan;
//   }
//   return SellerModel.findOne(query);
// };

// Create new seller
export const createSeller = (values: Record<string, any>) =>
  new SellerModel(values).save().then((seller) => seller.toObject());

// Delete seller
export const deleteSellerById = (id: String) => SellerModel.findOneAndDelete({ _id: id });

// Update seller
export const updateSellerById = (id: String, values: Record<string, any>) =>
  SellerModel.findByIdAndUpdate({ _id: id }, values, { new: true });
