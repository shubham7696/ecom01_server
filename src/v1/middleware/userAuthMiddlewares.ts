import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { get, merge } from "lodash";
import { getUserBySessionToken } from "../modules/user/controller/userHelper";
import { printConsoleLogs } from "../../utils/printConsoleLog";
import { appCookieConst } from "../../common/appConstants";

// ========== NOT IN USE RIGHT NOW ==========
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const header = req.headers["authorization"];
    if (!header || !header.startsWith("Bearer")) {
      res.status(401).json({ message: "Authorization Denied", success: false });
      return;
    }

    const token = header.split(" ")[1];
    // jwt.verify(token, process.env.JWT_SECRET as String, (err, decode) => {
    jwt.verify(token, "PQR456", (err, decode) => {
      if (err) {
        res.status(200).send({
          message: "Authentication Failure",
          success: false,
        });
      } else {
        next();
      }
    });
  } catch (error) {
    res.status(401).send({
      message: "Invalid token",
      success: false,
    });
  }
};

// // trying with cookies
// ========== Using for the user authentication ==========
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const sessionToken = req.cookies[appCookieConst];
    if (!sessionToken) {
      return res.status(400).send({ message: "Not authorized", success: false });
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      return res.status(403).send({ message: "User Not found", success: false });
    }
    merge(req, { userInfo: existingUser });
    next();
  } catch (error) {
    printConsoleLogs(error);
    return res.status(400).send({ message: "Authorization error", success: false });
  }
};
