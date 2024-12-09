import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./slices/adminSlice";
import userReducer from "./slices/userSlice";
import sellerReducer from "./slices/sellerSlice";
import productReducer from "./slices/productSlice";
export const store = configureStore({
  reducer: {
    admin: adminReducer,
    user: userReducer,
    seller: sellerReducer,
    product: productReducer,
    
  },
});

