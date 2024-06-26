import mongoose from 'mongoose';

export const SellerSchema = new mongoose.Schema({
  fullName: { type: String, required: [true, "Full name is required"], trim: true },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please fill a valid email address"],
  },
  userPhoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    unique: [true, "Number already registered"],
    match: [/^\+?[1-9]\d{1,14}$/, "Please fill a valid phone number"],
  },
  pan: {
    type: String,
    required: [true, "PAN is required"],
    unique: true,
    trim: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Please fill a valid PAN number"],
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    default: "male",
  },
  bankDetails: {
    type: String,
    default: null,
  },
  profilePicture: {
    type: String,
    default: null,
  },
  panPicture: {
    type: String,
    default: null,
  },
  authentication: {
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    sessionToken: {
      type: String,
      select: false,
    },
  },
  stores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store' }],
}, { timestamps: true });

export const SellerModel = mongoose.model("Sellers", SellerSchema);