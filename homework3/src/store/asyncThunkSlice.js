// import {createSlice} from "@reduxjs/toolkit";
import { createSlice, createAsyncThunk } from "../rtk-nut";
// import {createSlice} from "../rtk-nut";

export const thunkActionCreator = createAsyncThunk(
  "some async type",
  (letItSuccess) =>
    new Promise((resolve, reject) => {
      setTimeout(
        () => (letItSuccess ? resolve("some data") : reject("some reason")),
        1000
      );
    })
);

export const asyncThunkSlice = createSlice({
  name: "asyncThunk",
  initialState: {
    loading: false,
    data: null,
    reason: null,
  },
  extraReducers(builder) {
    builder.addCase(thunkActionCreator.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(thunkActionCreator.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.reason = null;
    });
    builder.addCase(thunkActionCreator.rejected, (state, action) => {
      state.loading = false;
      state.reason = action.payload;
      state.data = null;
    });
  },
});

export default asyncThunkSlice.reducer;
