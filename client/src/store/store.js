import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice.js";
import webReducer from "./web/webSlice.js";

const store = configureStore({
  reducer: {
    user: userReducer,
    web: webReducer,
  },
});

export default store;
