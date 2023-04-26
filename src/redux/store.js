import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import entrySlice from "./entrySlice";

export const store = configureStore({
  reducer: entrySlice,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
