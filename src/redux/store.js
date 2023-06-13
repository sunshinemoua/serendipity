import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { userReducer } from "./usersSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
