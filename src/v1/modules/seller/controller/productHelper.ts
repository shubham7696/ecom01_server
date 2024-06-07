import { ProductModel, ProductDoc } from "../models/productModel";

// Create a new product
export const createProduct = async (values: Record<string, any>): Promise<ProductDoc> => {
  const product = new ProductModel(values);
  return product.save();
};

// Get a product by ID
export const getProductById = async (id: string): Promise<ProductDoc | null> => {
  return ProductModel.findById(id).exec();
};

// Get all products
export const getProducts = async (): Promise<ProductDoc[]> => {
  return ProductModel.find().exec();
};

// Update a product by ID
export const updateProductById = async (
  id: string,
  values: Record<string, any>
): Promise<ProductDoc | null> => {
  return ProductModel.findByIdAndUpdate(id, values, { new: true }).exec();
};

// Delete a product by ID
export const deleteProductById = async (id: string): Promise<ProductDoc | null> => {
  return ProductModel.findByIdAndDelete(id).exec();
};
