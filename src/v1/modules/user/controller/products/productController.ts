import { Request, Response } from "express";
import {
  createProduct,
  deleteProductById,
  getProductById,
  getProducts,
  getStoreProducts,
  updateProductById,
} from "./productHelper";

import mongoose from "mongoose";
import { printConsoleLogs } from "../../../../../../src/utils/printConsoleLog";
import { ProductModel } from "../../../../modules/seller/models/productModel";



// Get newly added products list 
export const getNewlyAddedProductsController = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const products = await ProductModel.find({})
      .sort({ createdAt: -1 }) // Sort by creation time (newest first)
      .skip(skip)
      .limit(limit);

    const total = await ProductModel.countDocuments({});

    return res.status(200).send({
      message: "Newly added products fetched successfully",
      success: true,
      data: {products: products},
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching newly added products:", error);
    return res.status(500).send({ message: "Failed to fetch products", success: false });
  }
};


//Get Products by Discount (Paginated)
export const getProductsByDiscountController = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const discount = parseInt(req.query.discount as string) || 0;
    const skip = (page - 1) * limit;

    const products = await ProductModel.find({ discount: { $gte: discount } })
      .sort({ discount: -1 }) // Sort by discount (highest first)
      .skip(skip)
      .limit(limit);

    const total = await ProductModel.countDocuments({ discount: { $gte: discount } });

    return res.status(200).send({
      message: "Products by discount fetched successfully",
      success: true,
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching products by discount:", error);
    return res.status(500).send({ message: "Failed to fetch products", success: false });
  }
};

// Get products by category
export const getProductsByCategoryController = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string;
    const skip = (page - 1) * limit;

    const products = await ProductModel.find({ category })
      .skip(skip)
      .limit(limit);

    const total = await ProductModel.countDocuments({ category });

    return res.status(200).send({
      message: "Products by category fetched successfully",
      success: true,
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return res.status(500).send({ message: "Failed to fetch products", success: false });
  }
};


// Get products by gender
export const getProductsByGenderController = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const gender = req.query.gender as string;
    const skip = (page - 1) * limit;

    const query = gender === "all" ? {} : { gender: { $in: [gender, "unisex"] } };

    const products = await ProductModel.find(query).skip(skip).limit(limit);

    const total = await ProductModel.countDocuments({ gender });

    return res.status(200).send({
      message: "Products by gender fetched successfully",
      success: true,
      data: {products},
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching products by gender:", error);
    return res.status(500).send({ message: "Failed to fetch products", success: false });
  }
};

