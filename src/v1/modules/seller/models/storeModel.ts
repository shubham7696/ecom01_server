import mongoose from "mongoose";

export const StoreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    timing: { type: String, required: true, trim: true },
    contactDetails: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please fill a valid email address"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^\+?[1-9]\d{1,14}$/, "Please fill a valid phone number"],
    },
    gstNumber: {
      type: String,
      required: false,
      match: [
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        "Please fill a valid GST number",
      ],
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Products" }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
  },
  { timestamps: true }
);

export const StoreModel = mongoose.model("Stores", StoreSchema);