import { createSlice } from "@reduxjs/toolkit";

const usersList =
  localStorage.getItem("users") !== null
    ? JSON.parse(localStorage.getItem("users"))
    : [];

const entriesList =
  localStorage.getItem("entries") !== null
    ? JSON.parse(localStorage.getItem("entries"))
    : [];

const verifiedUser =
  localStorage.getItem("verifiedUser") !== null
    ? JSON.parse(localStorage.getItem("verifiedUser"))
    : false;

const setUserFunc = (user) => {
  localStorage.setItem("users", JSON.stringify(user));
};

const setVerifiedUsersFunc = (verified) => {
  localStorage.setItem("verifiedUser", JSON.stringify(verified));
};

const setEntriesFunc = (entry) => {
  localStorage.setItem("entries", JSON.stringify(entry));
};

export const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: usersList,
    entries: entriesList,
    verifiedUser: verifiedUser,
  },
  reducers: {
    addUser: (state, { payload }) => {
      console.log(payload);

      const existingUserEmail = state.users.map((user) => user.email);
      console.log(existingUserEmail);

      const isEmailExist = existingUserEmail.find(
        (email) => email === payload.email
      );

      if (isEmailExist) {
        alert("Email already exists, please sign in");
      } else {
        const newUser = {
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          entries: [],
          verified: true,
        };

        const updatedUsers = [newUser, ...state.users];
        state.users = updatedUsers;
        state.verifiedUser = newUser;

        setUserFunc(state.users);
        setVerifiedUsersFunc(state.verifiedUser);

        console.log(state.users);
      }
    },

    checkUser: (state, { payload }) => {
      const existingUserEmail = state.users.map((user) => user.email);
      console.log(existingUserEmail);

      const isEmailExist = existingUserEmail.find(
        (email) => email === payload.email
      );
      console.log(isEmailExist);

      if (isEmailExist) {
        state.users.map((user) =>
          user.email === isEmailExist
            ? (state.verifiedUser = Object.assign({ ...user, verified: true }))
            : null
        );

        const update = state.users.map((user) =>
          user.email === state.verifiedUser.email ? state.verifiedUser : user
        );
        console.log(update);
        state.users = update;
        setUserFunc(update);

        setVerifiedUsersFunc(state.verifiedUser);

        state.entries = state.verifiedUser.entries;
        setEntriesFunc(state.entries);
      } else {
        alert("email not found, please try again or create account");
      }
    },

    logOut: (state) => {
      const logOut = { ...verifiedUser, verified: false };
      state.verifiedUser = logOut;
      setVerifiedUsersFunc(state.verifiedUser);

      if (verifiedUser) {
        state.users = state.users.map((user) =>
          user.email === verifiedUser.email ? logOut : user
        );
        setUserFunc(state.users);
      }

      localStorage.removeItem("entries");
      localStorage.removeItem("verifiedUser");
    },

    deleteAllUsers: (state) => {
      state.users = [];
      localStorage.removeItem("users");
      localStorage.removeItem("entries");
      localStorage.removeItem("verifiedUser");
    },
    ////////////////////////////////////////////////////////////////
    addEntry: (state, { payload }) => {
      const loggedIn = verifiedUser.verified;

      console.log(verifiedUser, loggedIn);

      if (loggedIn) {
        state.entries = [...verifiedUser.entries, payload];
        setEntriesFunc(state.entries);

        console.log(state.entries);

        const newVerifiedObj = { ...verifiedUser, entries: state.entries };
        setVerifiedUsersFunc(newVerifiedObj);
        console.log(state.entries, newVerifiedObj);

        const update = state.users.map((user) =>
          user.email === verifiedUser.email ? newVerifiedObj : user
        );
        console.log(update);
        state.users = update;
        setUserFunc(update);
      }
    },
    deleteEntry: (state, { payload }) => {
      state.entries = payload;

      localStorage.setItem("entries", JSON.stringify(state.entries));

      const updatedEntries = JSON.parse(localStorage.getItem("entries"));

      const loggedInUser = JSON.parse(localStorage.getItem("verifiedUser"));
      const loggedInUserObj = { ...loggedInUser, entries: updatedEntries };
      state.verifiedUser = loggedInUserObj;
      setVerifiedUsersFunc(state.verifiedUser);

      const existingUserEmail = state.users.map((user) => user.email);
      const isEmailExist = existingUserEmail.find(
        (email) => email === loggedInUser.email
      );
      console.log(existingUserEmail, isEmailExist);

      if (isEmailExist) {
        const updates = state.users.map((user) =>
          user.email === isEmailExist ? loggedInUserObj : user
        );
        console.log(updates);
        state.users = updates;
        setUserFunc(state.users);
      }
    },

    deleteAllEntries: (state) => {
      state.users.entries = [];
      localStorage.removeItem("entries");
    },
  },
});

export const {
  addUser,
  checkUser,
  logOut,
  deleteAllUsers,
  addEntry,
  deleteEntry,
  deleteAllEntries,
} = usersSlice.actions;
export const userReducer = usersSlice.reducer;
