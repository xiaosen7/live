// import {configureStore} from "@reduxjs/toolkit";
import { configureStore } from "../rtk-nut";
// import {configureStore} from "../rtk-nut";
import counterReducer from "./counterSlice";
import asyncThunkReducer from "./asyncThunkSlice";

export default configureStore({
  reducer: {
    counter: counterReducer,
    asyncThunk: asyncThunkReducer,
  },
});
