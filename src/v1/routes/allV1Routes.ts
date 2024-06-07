import userRoutes from "../modules/user/routes/userRoutes";
import sellerRoutes from "../modules/seller/routes/sellerRoutes";
import storeRoutes from "../modules/seller/routes/storeRouets";

{/* 
 * Add all the routes here 
 * for sub modules such as user seller shop orders 
 * manage them independently in sub-folders
 * */}
const allV1Routes = [
  { path: '/api/v1/user', route: userRoutes },
  { path: '/api/v1/seller', route: sellerRoutes },
  { path: '/api/v1/store', route: storeRoutes },
];

export default allV1Routes;