import {createStore, combineReducers} from "../redux-nut/index";
import createSlice from "./createSlice";

export function configureStore({reducer}) {
  const rootReducer = combineReducers(reducer);
  const store = createStore(rootReducer);

  return store;
}

export {createSlice};
