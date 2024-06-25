import { Request, Response } from "express";
import { UserModel } from "../../models/userModel";
import mongoose from "mongoose";
import { ProductModel } from "../../../seller/models/productModel";
import { printConsoleLogs } from "../../../../../utils/printConsoleLog";

// Add products to cart
export const addProductToCart = async (req: Request, res: Response) => {
  console.log("##############", req.userInfo);

  const userId = req.userInfo._id;
  const { productId, quantity } = req.body;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(400).send({ message: "User not found", success: false });
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(400).send({ message: "Product not found", success: false });
    }

    const cartItemIndex = user.cart.findIndex((item: any) => item.product.toString() === productId);
    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity += quantity;
    } else {
      user.cart.push({ product: new mongoose.Schema.Types.ObjectId(product._id), quantity });
    }

    await user.save();
    return res.status(200).send({ message: "Product added to cart", cart: user.cart });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return res.status(500).send({ message: "Failed to add product to cart" });
  }
};

// add or remove items if there are multiple items
export const updateCartItemQuantity = async (req: Request, res: Response) => {
  const userId = req.body.user.id;
  const { productId, quantity } = req.body;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(400).send({ message: "User not found", success: false });
    }

    const cartItemIndex = user.cart.findIndex((item: any) => item.product.toString() === productId);
    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity = quantity;

      if (user.cart[cartItemIndex].quantity <= 0) {
        user.cart.splice(cartItemIndex, 1);
      }

      await user.save();
      return res.status(200).send({ message: "Cart item quantity updated", data: user.cart });
    } else {
      return res.status(400).send({ message: "Product not found in cart", success: false });
    }
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return res.status(500).send({ message: "Failed to update cart item quantity" });
  }
};

// delete item from cart
export const deleteCartItem = async (req: Request, res: Response) => {
  const userId = req.body.user.id;
  const { productId } = req.body;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(400).send({ message: "User not found", success: false });
    }

    const cartItemIndex = user.cart.findIndex((item: any) => item.product.toString() === productId);
    if (cartItemIndex > -1) {
      user.cart.splice(cartItemIndex, 1);
      await user.save();
      return res.status(200).send({ message: "Product removed from cart", cart: user.cart });
    } else {
      return res.status(400).send({ message: "Product not found in cart", success: false });
    }
  } catch (error) {
    console.error("Error removing product from cart:", error);
    return res.status(500).send({ message: "Failed to remove product from cart" });
  }
};

// get all the items user added in cart
export const getCartItems = async (req: Request, res: Response) => {
  const userId = req.body.user.id; // Assuming user ID is stored in req.user

  try {
    const user = await UserModel.findById(userId).populate("cart.product");
    if (!user) {
      return res.status(400).send({ message: "User not found", success: false });
    }

    return res.status(200).send({
      message: "Cart items fetched successfully",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return res.status(500).send({ message: "Failed to fetch cart items" });
  }
};
