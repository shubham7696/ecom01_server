import mongoose from "mongoose";
import { UserSchema } from "../models/userModel";

export const UserModel = mongoose.model("User", UserSchema);

// get user by different methods.
// Fetch users from the database, including only the necessary fields
export const getUsers = (query: {}, projections: {}) => UserModel.find(query, projections);

export const getUserByEmail = (email: String) => UserModel.findOne({email});
export const getUserByPhone = (userPhoneNumber: String) => UserModel.findOne({userPhoneNumber});
export const getUserBySessionToken = (sessionToken: String) => UserModel.findOne({'authentication.sessionToken': sessionToken});
export const getUserById = (id: String) => UserModel.findById({_id : id});

// create new user
export const createUser = (values: Record<string,any>) => new UserModel(values).save().then((user)=>user.toObject()); 
// delete user 
export const deleteUserById = (id: String) => UserModel.findOneAndDelete({_id: id});
// update user
export const updateUserById = (id: String, values: Record<string,any>) => UserModel.findByIdAndUpdate({_id: id}, values);


