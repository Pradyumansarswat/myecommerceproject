import { configureStore } from "@reduxjs/toolkit";
import sellerReducer from "./slices/sellerSlice";
import sellerProductReducer from "./slices/sellerProductSlice";
import categoryReducer from "./slices/categorySlice";
import variantReducer from "./slices/variantSlice";
const store = configureStore({
  reducer: {
    seller: sellerReducer,
    sellerProduct: sellerProductReducer,
    category: categoryReducer,
    variant: variantReducer
  },
});

export default store;
