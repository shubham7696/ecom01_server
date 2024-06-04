import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const header = req.headers["authorization"];
        if(!header || !header.startsWith("Bearer")){
            res.status(401).json({message:"Authorization Denied", success: false})
            return;
        }

        const token = header.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET as String, (err, decode) => {
            if (err){
                res.status(200).send({
                    message:"Authentication Failure",
                    success: false
                });
            } else {
                next();
            }
        })
    } catch (error) {
        console.log("=========== catch ", error);
        res.status(401).send({
            message: "Invalid token",
            success: false,
        })
    }
}

export default authMiddleware;