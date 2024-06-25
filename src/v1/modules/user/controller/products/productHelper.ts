import { ProductModel, ProductDoc } from "../../models/productModel";

// Create a new product
export const createProduct = async (value: any): Promise<ProductDoc> => {
  const product = new ProductModel(value);
  return product.save();
};

// Get a product by ID
export const getProductById = async (id: string) => {
  return ProductModel.findById(id).exec();
};

// Get all products
export const getProducts = async () => {
  return ProductModel.find().exec();
};

// Update a product by ID
export const updateProductById = async (
  id: string,
  values: Record<string, any>
) => {
  return ProductModel.findByIdAndUpdate(id, values, { new: true }).exec();
};

// Delete a product by ID
export const deleteProductById = async (id: string) => {
  return ProductModel.findByIdAndDelete(id).exec();
};

// Delete a product by ID
export const getStoreProducts = async (storeId: string) => {
   return ProductModel.find({ storeId: storeId });
};
