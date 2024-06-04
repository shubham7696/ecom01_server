import mongoose from "mongoose";
import { UserSchema } from "../../models/users/users";

export const UserModel = mongoose.model("User", UserSchema);

// get user by different methods.
export const getUsers = () => UserModel.find();
export const getUsersByEmail = (email: String) => UserModel.findOne({email});
export const getUsersByPhone = (userPhoneNumber: String) => UserModel.findOne({userPhoneNumber});
export const getUsersBySessionToken = (sessionToken: String) => 
    UserModel.findOne({'authentication.sessionToken': sessionToken});
export const getUsersById = (id: String) => UserModel.findById({id});

// create new user
export const createUser = (values: Record<string,any>) => new UserModel(values).save().then((user)=>user.toObject()); 
// delete user 
export const deleteUserById = (id: String) => UserModel.findOneAndDelete({_id: id});
// update user
export const updateUserById = (id: String, values: Record<string,any>) => UserModel.findByIdAndUpdate(id, values);