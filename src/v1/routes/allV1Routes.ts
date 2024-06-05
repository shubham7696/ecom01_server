import userRoutes from "../modules/user/routes/userRoutes";
import sellerRoutes from "../modules/seller/routes/sellerRoutes";

const allV1Routes = [
  { path: '/api/v1/user', route: userRoutes },
  { path: '/api/v1/seller', route: sellerRoutes },
];

export default allV1Routes;