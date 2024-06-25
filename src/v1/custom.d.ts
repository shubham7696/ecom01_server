import { UserDoc } from "./modules/user/models/userModel"; // Adjust the path according to your project structure

declare global {
  namespace Express {
    interface Request {
      userInfo?: UserDoc;
    }
  }
}
