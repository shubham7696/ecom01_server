import express from 'express';
import jwt from 'jsonwebtoken';
import { printConsoleLogs } from '../../../../utils/printConsoleLog';
import { appCookieConst } from '../../../../common/appConstants';
import { getStores, getSellerStores, getStoreById, getStoreByEmail, getStoreByPhone, createStore, deleteStoreById, updateStoreById } from './storeHelper';

// Get all stores
export const getAllStoresController = async (req: express.Request, res: express.Response) => {
  try {
    const stores = await getStores();
    return res.status(200).send({ message: "Stores fetched successfully", success: true, data: stores });
  } catch (error) {
    console.error("Error fetching stores:", error);
    return res.status(500).send({ message: "Failed to fetch stores", success: false });
  }
};

// Get stores of a specific seller
export const getSellerStoresController = async (req: express.Request, res: express.Response) => {
  try {
    const { sellerId } = req.params;
    const stores = await getSellerStores(sellerId);
    return res.status(200).send({ message: "Seller's stores fetched successfully", success: true, data: stores });
  } catch (error) {
    console.error("Error fetching seller's stores:", error);
    return res.status(500).send({ message: "Failed to fetch seller's stores", success: false });
  }
};

// Get store by ID
export const getStoreByIdController = async (req: express.Request, res: express.Response) => {
  try {
    const { storeId } = req.params;
    const store = await getStoreById(storeId);
    if (!store) {
      return res.status(400).send({ message: "Store not found", success: false });
    }
    return res.status(200).send({ message: "Store fetched successfully", success: true, data: store });
  } catch (error) {
    console.error("Error fetching store:", error);
    return res.status(500).send({ message: "Failed to fetch store", success: false });
  }
};

// Add new store
export const addStoreController = async (req: express.Request, res: express.Response) => {
  try {
    const { name, location, timing, contactDetails, email, phone, gstNumber } = req.body;
    const { sellerId } = req.params;

    const newStore = await createStore({ name, location, timing, contactDetails, email, phone, gstNumber, owner: sellerId });
    return res.status(201).send({ message: "Store added successfully", success: true, data: newStore });
  } catch (error) {
    console.error("Error adding store:", error);
    return res.status(500).send({ message: "Failed to add store", success: false });
  }
};

// Update store by ID
export const updateStoreController = async (req: express.Request, res: express.Response) => {
  try {
    const { storeId } = req.params;
    const updates = req.body;

    const updatedStore = await updateStoreById(storeId, updates);
    if (!updatedStore) {
      return res.status(404).send({ message: "Store not found", success: false });
    }

    return res.status(200).send({ message: "Store updated successfully", success: true, data: updatedStore });
  } catch (error) {
    console.error("Error updating store:", error);
    return res.status(500).send({ message: "Failed to update store", success: false });
  }
};

// Delete store by ID
export const deleteStoreController = async (req: express.Request, res: express.Response) => {
  try {
    const { storeId } = req.params;

    const deletedStore = await deleteStoreById(storeId);
    if (!deletedStore) {
      return res.status(404).send({ message: "Store not found", success: false });
    }

    return res.status(200).send({ message: "Store deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting store:", error);
    return res.status(500).send({ message: "Failed to delete store", success: false });
  }
};