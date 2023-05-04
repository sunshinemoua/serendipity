import { createSlice } from "@reduxjs/toolkit";

const usersList =
  localStorage.getItem("users") !== null
    ? JSON.parse(localStorage.getItem("users"))
    : [];

const setUserFunc = (usersList) => {
  localStorage.setItem("users", JSON.stringify(usersList));
};

export const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: usersList,
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
        console.log(newUsers);
      }
    },
  },
});

export const { addUser } = usersSlice.actions;
export const userReducer = usersSlice.reducer;
