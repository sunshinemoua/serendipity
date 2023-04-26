import { createSlice } from "@reduxjs/toolkit";

export const entrySlice = createSlice({
  name: "entry",
  initialState: {
    entries: [],
    submission: "",
  },

  reducers: {
    addEntry: (state, { payload }) => {
      state.entries = [payload, ...state.entries];
      console.log(payload);
      //   console.log(state.entries);
    },
  },
});

export const { testconsole, addEntry } = entrySlice.actions;
export default entrySlice.reducer;
