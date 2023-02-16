// import {configureStore} from "@reduxjs/toolkit";
import {configureStore} from "../rtk-nut";
// import {configureStore} from "../rtk-nut";
import counterReducer from "./counterSlice";

export default configureStore({
  reducer: {
    counter: counterReducer,
  },
});
