import { createSlice } from "@reduxjs/toolkit";

const usersList =
  localStorage.getItem("users") !== null
    ? JSON.parse(localStorage.getItem("users"))
    : [];

const entriesList =
  localStorage.getItem("entries") !== null
    ? JSON.parse(localStorage.getItem("users"))
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
// const setEntriesFunc = (entriesList) => {
//   localStorage.setItem("users", JSON.stringify(entriesList));
// };
// const setVerifiedFunc = (verified) => {
//   localStorage.setItem("users", JSON.stringify(verified));
// };

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

        // const newUser = {
        //   email: payload.email,
        //   info: {
        //     firstName: payload.firstName,
        //     lastName: payload.lastName,
        //     entries: [],
        //     verified: true,
        //   },
        // };

        const updatedUsers = [newUser, ...state.users];
        state.users = updatedUsers;
        state.verifiedUser = newUser;

        setUserFunc(state.users);
        setVerifiedUsersFunc(newUser);

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
        const update = state.users.map((user) =>
          user.email === isEmailExist
            ? (state.verifiedUser = { ...user, verified: true })
            : null
        );
        setVerifiedUsersFunc(update);

        state.entries = state.verifiedUser.entries;
        setEntriesFunc(state.entries);
      }
    },

    logOut: (state) => {
      const logOut = { ...state.verifiedUser, verified: false };
      state.verifiedUser = logOut;
      setVerifiedUsersFunc(state.verifiedUser);

      const existingUserEmail = state.users.map((user) => user.email);
      const isEmailExist = existingUserEmail.find(
        (email) => email === logOut.email
      );
      console.log(existingUserEmail, isEmailExist);

      if (isEmailExist) {
        const updates = state.users.map((user) =>
          user.email === isEmailExist ? logOut : user
        );
        console.log(updates);
        state.users = updates;
        setUserFunc(state.users);
      }

      localStorage.removeItem("entries");
      localStorage.removeItem("verifiedUser");
    },

    deleteAllUsers: (state) => {
      state.users = [];
      localStorage.removeItem("users");
    },
    ////////////////////////////////////////////////////////////////
    addEntry: (state, { payload }) => {
      state.entries = [payload, ...state.entries];
      setEntriesFunc(state.entries);

      const loggedInUser = JSON.parse(localStorage.getItem("verifiedUser"));

      if (state.verifiedUser) {
        state.entries = [...state.verifiedUser.entries, payload];
        const test = { ...state.verifiedUser, entries: state.entries };

        setEntriesFunc(state.entries);
        setVerifiedUsersFunc(test);
      }
      const loggedInUserObj = { ...loggedInUser, entries: state.entries };
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
    deleteEntry: (state, { payload }) => {
      state.entries = payload;

      localStorage.setItem(
        "entries",
        JSON.stringify(state.entries.map((item) => item))
      );

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
