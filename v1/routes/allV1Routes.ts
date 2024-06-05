import userRoutes from "./userRoutes";
import sellerRoutes from "./sellerRoutes";

const allV1Routes = [
  { path: '/api/v1/user', route: userRoutes },
  { path: '/api/v1/seller', route: sellerRoutes },
];

export default allV1Routes;