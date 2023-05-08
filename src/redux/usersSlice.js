import { createSlice } from "@reduxjs/toolkit";
import { uuid } from "uuidv4";

const usersList =
  localStorage.getItem("users") !== null
    ? JSON.parse(localStorage.getItem("users"))
    : [];

const verified =
  localStorage.getItem("verified") !== null
    ? JSON.parse(localStorage.getItem("verified"))
    : false;

const setUserFunc = (usersList) => {
  localStorage.setItem("users", JSON.stringify(usersList));
};

const setVerifiedFunc = (verified) => {
  localStorage.setItem("verified", JSON.stringify(verified));
};

export const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: usersList,
    verifiedUsers: verified,
  },
  reducers: {
    addUser: (state, { payload }) => {
      const existingUserEmail = state.users.map((user) => user.email);

      const isEmailExist = existingUserEmail.find(
        (email) => email === payload.email
      );

      if (isEmailExist) {
        alert("Email already exists, please sign in");
      } else {
        const newUsers = [payload, ...state.users];
        state.users = newUsers;
        setUserFunc(state.users);
        alert("Thanks for signing up");
      }
    },

    checkUser: (state, { payload }) => {
      const existingUserEmail = state.users.map((user) => user.email);
      const isEmailExist = existingUserEmail.find(
        (email) => email === payload.email
      );
      if (isEmailExist) {
        payload.verified = true;
        state.verifiedUsers = payload;
        console.log(state.verifiedUsers);
        setVerifiedFunc(state.verifiedUsers);
        alert("access granted");
      } else {
        payload.verified = false;
        state.verifiedUsers = payload;
        alert("email not found, please create account");
      }
    },

    logOut: (state) => {
      state.verifiedUsers = false;
      localStorage.removeItem("verified");
    },

    deleteAllUsers: (state) => {
      state.users = [];
      localStorage.removeItem("users");
    },
  },
});

export const { addUser, checkUser, logOut, deleteAllUsers } =
  usersSlice.actions;
export const userReducer = usersSlice.reducer;
