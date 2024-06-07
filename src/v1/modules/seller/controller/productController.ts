import { Request, Response } from 'express';
import {createProduct } from './productHelper';

// Create a new product
export const createProductController = async (req: Request, res: Response) => {
  try {
    const { productName, productDescription, keyFeatures, category, tags, availableQty, minimumOrderQty, currentRating, length, height, width, weight, media, maxRetailPrice, currentDiscount, currentAmount, customAttributes, storeId } = req.body;
    const sellerId = req.seller?._id;

    const newProduct = await createProduct({
      productName,
      productDescription,
      keyFeatures,
      category,
      tags,
      availableQty,
      minimumOrderQty,
      currentRating,
      length,
      height,
      width,
      weight,
      media,
      maxRetailPrice,
      currentDiscount,
      currentAmount,
      customAttributes,
      seller: sellerId,
      store: storeId,
    });

    return res.status(200).send({ message: "Product created successfully", success: true, product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).send({ message: "Failed to create product", success: false });
  }
};

// Get a product by ID
export const getProductController = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const product = await ProductHelper.getProductById(productId);

    if (!product) {
      return res.status(404).send({ message: "Product not found", success: false });
    }

    return res.status(200).send({ message: "Product fetched successfully", success: true, product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).send({ message: "Failed to fetch product", success: false });
  }
};

// Get all products
export const getProductsController = async (req: Request, res: Response) => {
  try {
    const products = await ProductHelper.getProducts();
    return res.status(200).send({ message: "Products fetched successfully", success: true, products });
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

    const updatedProduct = await ProductHelper.updateProductById(productId, updates);

    if (!updatedProduct) {
      return res.status(404).send({ message: "Product not found", success: false });
    }

    return res.status(200).send({ message: "Product updated successfully", success: true, product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).send({ message: "Failed to update product", success: false });
  }
};

// Delete a product
export const deleteProductController = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const deletedProduct = await ProductHelper.deleteProductById(productId);

    if (!deletedProduct) {
      return res.status(404).send({ message: "Product not found", success: false });
    }

    return res.status(200).send({ message: "Product deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).send({ message: "Failed to delete product", success: false });
  }
};
