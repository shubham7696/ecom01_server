import express from "express";
import multer from "multer"
import { printConsoleLog, printConsoleLogs } from "../../../utils/printConsoleLog";

// GET ALL USERs  ========================================
export const getAllUserController = async (req: express.Request, res: express.Response) => {
  try {
    printConsoleLog(req.body);
    printConsoleLog(req.file);
    return res.redirect("/");
  } catch(error) {
    printConsoleLogs("==========",error, "==========", `${"some"}`)
    return res.status(500).send({ message: "Unable to fetch users", success: false });
  }
}