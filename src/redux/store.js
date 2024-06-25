import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import productReducer from "./reducers/productReducer";
import cartReducer from "./reducers/cartReducer";
import commonUiReducer from "./reducers/commonUiReducer";
import orderReducer from "./reducers/orderReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    cart: cartReducer,
    ui: commonUiReducer,
    order: orderReducer,
  },
});
export default store;
