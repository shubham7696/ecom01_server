import { Request, Response } from "express";
import { UserDoc, UserModel } from "../../models/userModel";
import mongoose from "mongoose";
import { ProductModel } from "../../../seller/models/productModel";
import { printConsoleLogs } from "../../../../../utils/printConsoleLog";

interface IUserRequest extends Request {
  userInfo: UserDoc;
}

// Add products to cart
export const addProductToCart = async (req: IUserRequest, res: Response) => {
  const userId = req?.userInfo._id;
  const { productId, quantity } = req.body;

    printConsoleLogs("###############");

    printConsoleLogs("called add user product to cart");
    printConsoleLogs("###############");
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(400).send({ message: "User not found", success: false });
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(400).send({ message: "Product not found", success: false });
    }

    let cartItemIndex = -1;
    if (user.cart && user.cart?.length > 0) {
      cartItemIndex = user.cart.findIndex((item: any) => item.product.equals(productId));
    }
    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity += quantity;
    } else {
      printConsoleLogs("##########", "this one here", `${product._id}`, "##########");
      user.cart.push({ product: product._id, quantity });
    }
      printConsoleLogs("##########", user, "##########");
    await user.save();
    return res.status(200).send({ message: "Product added to cart", data: user.cart });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return res.status(500).send({ message: "Failed to add product to cart", success: false });
  }
};

// add or remove items if there are multiple items
export const updateCartItemQuantity = async (req: IUserRequest, res: Response) => {
  const userId = req?.userInfo.id;
  const { productId, quantity } = req.body;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(400).send({ message: "User not found", success: false });
    }

    const cartItemIndex = user.cart.findIndex((item: any) => item._id.toString() === productId);
    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity = quantity;

      if (user.cart[cartItemIndex].quantity <= 0) {
        user.cart.splice(cartItemIndex, 1);
      }

      await user.save();
      return res.status(200).send({ message: "Cart item quantity updated", success: true, data: user.cart });
    } else {
      return res.status(400).send({ message: "Product not found in cart", success: false });
    }
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return res.status(500).send({ message: "Failed to update cart item quantity", success: false });
  }
};

// delete item from cart
export const deleteCartItem = async (req: IUserRequest, res: Response) => {
  const userId = req?.userInfo._id;
  const { productId } = req.params;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(400).send({ message: "User not found", success: false });
    }
    const cartItemIndex = user.cart.findIndex((item: any) => item._id.toString() === productId);
    if (cartItemIndex > -1) {
      user.cart.splice(cartItemIndex, 1);
      await user.save();
      return res
        .status(200)
        .send({ message: "Product removed from cart", success: true, data: user.cart });
    } else {
      return res.status(400).send({ message: "Product not found in cart", success: false });
    }
  } catch (error) {
    console.error("Error removing product from cart:", error);
    return res.status(500).send({ message: "Failed to remove product from cart", success: false });
  }
};


// get all the items user added in cart
export const getCartItems = async (req: IUserRequest, res: Response) => {
  const userId = req?.userInfo._id;

  try {
    const user = await UserModel.findById(userId).populate("cart.product");
    if (!user) {
      return res.status(400).send({ message: "User not found", success: false });
    }

    return res.status(200).send({
      message: "Cart items fetched successfully",
      success: true,
      data: user.cart,
    });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return res.status(500).send({ message: "Failed to fetch cart items" });
  }
};
