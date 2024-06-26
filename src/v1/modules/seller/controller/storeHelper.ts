import mongoose from "mongoose";
import { StoreModel } from "../models/storeModel";


// Get all stores from the database
export const getStores = () => StoreModel.find();

// Get stores of a specific seller
export const getSellerStores = (sellerId: String) => StoreModel.find({owner: sellerId});

// Get store by ID
export const getStoreById = (id: String) => StoreModel.findById({ _id: id });

// Get store by email
export const getStoreByEmail = (email: String) => StoreModel.findOne({ email });

// Get store by phone number
export const getStoreByPhone = (phone: String) => StoreModel.findOne({ phone });

// Create new store
export const createStore = (values: Record<string, any>) => new StoreModel(values).save().then((store) => store.toObject());

// Delete Seller by ID
export const deleteStoreById = (id: String) => StoreModel.findByIdAndDelete({_id: id});

// Update Seller by ID
export const updateStoreById = (id: String, values: Record<string, any>) => StoreModel.findByIdAndUpdate({_id: id}, values, { new: true });