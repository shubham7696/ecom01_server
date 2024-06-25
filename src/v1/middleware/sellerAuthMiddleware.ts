import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { get, merge } from "lodash";
import { printConsoleLogs } from "../../utils/printConsoleLog";
import { getSellerBySessionToken } from "../modules/seller/controller/seller/sellerHelper";
import { appCookieConst } from "../../common/appConstants";
import { StoreModel } from "../modules/seller/models/storeModel";

// // trying with cookies
export const isSellerAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionToken = req.cookies[appCookieConst];
    if (!sessionToken) {
      return res.status(400).send({ message: "Not authorized", success: false });
    }

    const existingUser = await getSellerBySessionToken(sessionToken);

    if (!existingUser) {
      return res.status(403).send({ message: "Seller Not found", success: false });
    }

    merge(req, { identity: existingUser });

    next();
  } catch (error) {
    printConsoleLogs(error);
    return res.status(400).send({ message: "Authorization error", success: false });
  }
};

export const isSellerOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const currentUserId = get(res, "identity._id") as string;
    if (!currentUserId) {
      return res.status(403).send({ message: "UnAuthorized user", success: false });
    }

    next();
  } catch (error) {
    printConsoleLogs(error);
    return res.status(400).send({ message: "Authorization error", success: false });
  }
};

export const isStoreOwnership = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { storeId } = req.params;
    const sellerId = get(req, "identity._id") as string;

    const store = await StoreModel.findById(storeId);
    if (!store) {
      return res.status(404).send({ message: "Store not found", success: false });
    }

    if (store.owner.toString() !== sellerId.toString()) {
      return res.status(403).send({ message: "Unauthorized action", success: false });
    }

    next();
  } catch (error) {
    console.error("Error checking store ownership:", error);
    return res.status(500).send({ message: "Failed to verify ownership", success: false });
  }
};

export const isProductOwnership = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { storeId } = req.params;
    const sellerId = get(req, "identity._id") as string;

    const store = await StoreModel.findById(storeId);
    if (!store) {
      return res.status(404).send({ message: "Store not found", success: false });
    }

    if (store.owner.toString() !== sellerId.toString()) {
      return res.status(403).send({ message: "Unauthorized action", success: false });
    }

    next();
  } catch (error) {
    console.error("Error checking store ownership:", error);
    return res.status(500).send({ message: "Failed to verify ownership", success: false });
  }
};
