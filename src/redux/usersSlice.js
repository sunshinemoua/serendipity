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
      const existingUserEmail = state.users.map((user) => user.email);

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
      }
    },

    checkUser: (state, { payload }) => {
      const existingUserEmail = state.users.map((user) => user.email);

      const isEmailExist = existingUserEmail.find(
        (email) => email === payload.email
      );

      if (isEmailExist) {
        state.users.map((user) =>
          user.email === isEmailExist
            ? (state.verifiedUser = Object.assign({ ...user, verified: true }))
            : null
        );

        const update = state.users.map((user) =>
          user.email === state.verifiedUser.email ? state.verifiedUser : user
        );

        state.users = update;
        setUserFunc(state.users);

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
      state.entries = [];
      localStorage.removeItem("entries");
      localStorage.removeItem("verifiedUser");
    },

    deleteAccount: (state, { payload }) => {
      const getVerifiedUser = JSON.parse(localStorage.getItem("verifiedUser"));
      const confirmDelete = window.confirm("Are you sure you want to delete?");

      if (getVerifiedUser && confirmDelete) {
        state.users.map((user) => {
          if (user.email === getVerifiedUser.email) {
            state.users = payload;
            setUserFunc(state.users);
            state.verifiedUser = { ...getVerifiedUser, verified: false };
            setVerifiedUsersFunc(state.verifiedUser);
            state.entries = [];
            alert("Account deleted successfully!");
            localStorage.removeItem("verifiedUser");
            localStorage.removeItem("entries");
          }
        });
      } else {
        alert("Sure thing! Thanks for sticking with us!");
      }
    },

    deleteAllUsers: (state) => {
      state.users = [];
      localStorage.removeItem("users");
      localStorage.removeItem("entries");
      localStorage.removeItem("verifiedUser");
    },
    //******* ENTRIES *******//
    addEntry: (state, { payload }) => {
      const getVerifiedUser = JSON.parse(localStorage.getItem("verifiedUser"));
      const loggedIn = getVerifiedUser.verified;

      if (loggedIn) {
        state.entries = [payload, ...getVerifiedUser.entries];
        setEntriesFunc(state.entries);

        const newVerifiedObj = { ...getVerifiedUser, entries: state.entries };
        setVerifiedUsersFunc(newVerifiedObj);

        const update = state.users.map((user) =>
          user.email === getVerifiedUser.email ? newVerifiedObj : user
        );
        state.users = update;
        setUserFunc(state.users);
      }
    },
    deleteEntry: (state, { payload }) => {
      const getVerifiedUser = JSON.parse(localStorage.getItem("verifiedUser"));

      state.entries = payload;
      localStorage.setItem("entries", JSON.stringify(state.entries));

      const updatedEntries = JSON.parse(localStorage.getItem("entries"));

      const loggedInUserObj = { ...getVerifiedUser, entries: updatedEntries };
      state.verifiedUser = loggedInUserObj;
      setVerifiedUsersFunc(state.verifiedUser);

      if (getVerifiedUser.email) {
        const updates = state.users.map((user) =>
          user.email === getVerifiedUser.email ? loggedInUserObj : user
        );
        state.users = updates;
        setUserFunc(state.users);
      }
    },

    deleteAllEntries: (state) => {
      const getVerifiedUser = JSON.parse(localStorage.getItem("verifiedUser"));

      const deleteAll = { ...getVerifiedUser, entries: [] };
      state.verifiedUser = deleteAll;
      setVerifiedUsersFunc(state.verifiedUser);

      if (getVerifiedUser) {
        const updates = state.users.map((user) =>
          user.email === getVerifiedUser.email ? deleteAll : user
        );
        state.entries = [];
        setEntriesFunc(state.entries);
        state.users = updates;
        setUserFunc(state.users);
      }
    },
  },
});

export const {
  addUser,
  checkUser,
  logOut,
  deleteAccount,
  deleteAllUsers,
  addEntry,
  deleteEntry,
  deleteAllEntries,
} = usersSlice.actions;
export const userReducer = usersSlice.reducer;
