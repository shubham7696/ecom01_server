import { Request, Response } from "express";
import {
  createProduct,
  deleteProductById,
  getProductById,
  getProducts,
  getStoreProducts,
  updateProductById,
} from "./productHelper";
import { getStoreById } from "../storeHelper";
import { ProductDoc, ProductModel } from "../../models/productModel";
import mongoose from "mongoose";
import { printConsoleLog, printConsoleLogs } from "../../../../../../src/utils/printConsoleLog";

// Create a new product
export const addNewProductController = async (req: Request, res: Response) => {
  try {
    let productModel: ProductDoc = req.body;

    // Find the store and update the products array
    const store = await getStoreById(productModel.storeId);

    // Find the store
    if (!store) {
      return res.status(400).send({ message: "Store not found", success: false });
    }

    const newProduct = await createProduct(productModel);

    printConsoleLog(`=============== \n ${newProduct} \n =============`);
    // Check if newProduct is valid and has an _id field
    if (!newProduct || !newProduct._id) {
      return res.status(500).send({ message: "Failed to create product", success: false });
    }

    store.products.push(new mongoose.Types.ObjectId(newProduct._id));
    await store.save();

    return res
      .status(200)
      .send({ message: "Product created successfully", success: true, product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).send({ message: "Failed to create product", success: false });
  }
};

// Get a product by ID
export const getProductByIdController = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const product = await getProductById(productId);

    if (!product) {
      return res.status(400).send({ message: "Product not found", success: false });
    }
    return res
      .status(200)
      .send({ message: "Product fetched successfully", success: true, product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).send({ message: "Failed to fetch product", success: false });
  }
};

// Get all products
export const getProductsController = async (req: Request, res: Response) => {
  try {
    const products = await getProducts();
    return res
      .status(200)
      .send({ message: "Products fetched successfully", success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).send({ message: "Failed to fetch products", success: false });
  }
};

// Update a product
export const updateProductController = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const updates = req.body;

    const updatedProduct = await updateProductById(productId, updates);

    if (!updatedProduct) {
      return res.status(404).send({ message: "Product not found", success: false });
    }

    return res
      .status(200)
      .send({ message: "Product updated successfully", success: true, product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).send({ message: "Failed to update product", success: false });
  }
};

// Delete a product
export const deleteProductController = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const deletedProduct = await deleteProductById(productId);

    if (!deletedProduct) {
      return res.status(404).send({ message: "Product not found", success: false });
    }

    return res.status(200).send({ message: "Product deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).send({ message: "Failed to delete product", success: false });
  }
};

// Get products of a specific store
export const getStoreProductsController = async (req: Request, res: Response) => {
  try {
    const { storeId } = req.params;
    const products = await getStoreProducts(storeId);
    return res
      .status(200)
      .send({ message: "Store's products fetched successfully", success: true, data: products });
  } catch (error) {
    console.error("Error fetching stores products:", error);
    return res.status(500).send({ message: "Failed to fetch products", success: false });
  }
};
