import { createSlice } from "@reduxjs/toolkit";

const usersList =
  localStorage.getItem("users") !== null
    ? JSON.parse(localStorage.getItem("users"))
    : [];

const setUserFunc = (usersList) => {
  localStorage.setItem("users", JSON.stringify(usersList));
};

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: usersList,
  },
  reducers: {
    addUser: (state, { payload }) => {
      console.log(payload);
      state.users = [payload];

      console.log(state.users);
    },
  },
});

export const { addUser } = usersSlice.actions;
export const userReducer = usersSlice.reducer;
