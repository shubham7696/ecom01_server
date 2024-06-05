import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
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
    unique: [true, "Number already Registered"],
    match: [/^\+?[1-9]\d{1,14}$/, "Please fill a valid phone number"],
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    default: "male",
    required: true,
  },
  profilePicture: {
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
}, {timestamps: true});

// Set field projections
// UserSchema.set('toJSON', {
//   transform: (doc, ret) => {
//     // Remove sensitive fields from the serialized document
//     delete ret.authentication;
//     delete ret.__v;
//     return ret;
//   }
// });