import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { entryReducer } from "./entrySlice";
import { userReducer } from "./usersSlice";

export const store = configureStore({
  reducer: {
    entry: entryReducer,
    user: userReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
