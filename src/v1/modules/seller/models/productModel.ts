import mongoose, { Document, Schema } from 'mongoose';
import { SellerDocument } from './sellerModel'; // Adjust the import path as needed
import { StoreDocument } from './storeModel';  // Adjust the import path as needed

// Define Product Interface
export interface ProductDoc extends Document {
  productName: string;
  productDescription: string;
  keyFeatures: string[];
  category: string;
  tags: string[];
  availableQty: number;
  minimumOrderQty: number;
  currentRating: number;
  length: number;
  height: number;
  width: number;
  weight: number;
  media: string[]; // Array of URLs to pictures or videos
  maxRetailPrice: number;
  currentDiscount: number;
  currentAmount: number;
  customAttributes: Record<string, string>;
  seller: SellerDocument['_id'];
  store: StoreDocument['_id'];
  createdAt: Date;
  updatedAt: Date;
}

// Define Product Schema
const ProductSchema: Schema = new Schema<ProductDoc>({
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  productDescription: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
  },
  keyFeatures: {
    type: [String],
    required: [true, 'Key features are required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  availableQty: {
    type: Number,
    required: [true, 'Available quantity is required'],
    min: [0, 'Available quantity cannot be negative'],
  },
  minimumOrderQty: {
    type: Number,
    required: [true, 'Minimum order quantity is required'],
    min: [1, 'Minimum order quantity must be at least 1'],
  },
  currentRating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5'],
  },
  length: {
    type: Number,
    required: [true, 'Length is required'],
    min: [0, 'Length cannot be negative'],
  },
  height: {
    type: Number,
    required: [true, 'Height is required'],
    min: [0, 'Height cannot be negative'],
  },
  width: {
    type: Number,
    required: [true, 'Width is required'],
    min: [0, 'Width cannot be negative'],
  },
  weight: {
    type: Number,
    required: [true, 'Weight is required'],
    min: [0, 'Weight cannot be negative'],
  },
  media: {
    type: [String],
    required: [true, 'Media (pictures or videos) are required'],
  },
  maxRetailPrice: {
    type: Number,
    required: [true, 'Maximum retail price is required'],
    min: [0, 'Maximum retail price cannot be negative'],
  },
  currentDiscount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100'],
  },
  currentAmount: {
    type: Number,
    required: [true, 'Current amount is required'],
    min: [0, 'Current amount cannot be negative'],
  },
  customAttributes: {
    type: Map,
    of: String,
    default: {},
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'Sellers',
    required: [true, 'Seller is required'],
  },
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Stores',
    required: [true, 'Store is required'],
  },
}, { timestamps: true });

// Create Product Model
export const ProductModel = mongoose.model<ProductDoc>('Products', ProductSchema);
