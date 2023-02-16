// import {createSlice} from "@reduxjs/toolkit";
import {createSlice} from "../rtk-nut";
// import {createSlice} from "../rtk-nut";

export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
  },
  // "reducers"
  // sliceName/reducerName
  // counter/increment
  reducers: {
    increment: (state) => {
      // 由于使用了Immerjs, rtk允许我们在reducers里直接修改状态，但是实际上state并没有发生改变
      // 这是因为 Immer 可以检测到变化， 并且产生一种新的 不可改变的 state
      state.value += 1;
      // return state.value + 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {increment, decrement, incrementByAmount} = counterSlice.actions;

export default counterSlice.reducer;
