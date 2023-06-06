import { createSlice } from "@reduxjs/toolkit";

// const entriesList =
//   localStorage.getItem("entries") !== null
//     ? JSON.parse(localStorage.getItem("entries"))
//     : [];

const setItemFunc = (entriesList) => {
  localStorage.setItem("entries", JSON.stringify(entriesList));
};

export const entrySlice = createSlice({
  name: "entry",
  initialState: {
    // entries: entriesList,
    entries: "no",
  },

  reducers: {
    addEntry: (state, { payload }) => {
      state.entries = [payload, ...state.entries];
      setItemFunc(state.entries.map((item) => item));
    },
    deleteEntry: (state, { payload }) => {
      state.entries = payload;

      localStorage.setItem(
        "entries",
        JSON.stringify(state.entries.map((item) => item))
      );
    },

    deleteAllEntries: (state) => {
      state.entries = [];
      localStorage.removeItem("entries");
    },
  },
});

export const { addEntry, deleteEntry, deleteAllEntries } = entrySlice.actions;
export const entryReducer = entrySlice.reducer;
