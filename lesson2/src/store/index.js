import isPromise from "is-promise";
// import {createStore, applyMiddleware, combineReducers} from "redux";
// import thunk from "redux-thunk";
// import logger from "redux-logger";
// import promise from "redux-promise";

import {createStore, applyMiddleware, combineReducers} from "../redux-nut";

// 定义了store修改规则
export function countReducer(state = 0, action) {
  switch (action.type) {
    case "ADD":
      return state + (action.payload || 1);
    case "MINUS":
      return state - (action.payload || 1);
    default:
      return state;
  }
}

export function countReducer2(state = 0, action) {
  switch (action.type) {
    case "ADD2":
      return state + (action.payload || 1);
    case "MINUS2":
      return state - (action.payload || 1);
    default:
      return state;
  }
}

// 创建store
const store = createStore(
  combineReducers({count: countReducer, count2: countReducer2}),
  applyMiddleware(thunk, promise, logger)
);

export default store;

function logger({getState}) {
  return (next) => (action) => {
    console.log("====================================");
    console.log(action.type + "执行了！"); //sy-log

    const prevState = getState();
    console.log("prev state", prevState); //sy-log

    const returnValue = next(action);
    const nextState = getState();
    console.log("next state", nextState); //sy-log
    console.log("====================================");
    return returnValue;
  };
}

function thunk({getState, dispatch}) {
  return (next) => (action) => {
    if (typeof action === "function") {
      return action(dispatch, getState);
    }
    return next(action);
  };
}

function promise({getState, dispatch}) {
  return (next) => (action) => {
    if (isPromise(action)) {
      return action.then(dispatch, getState);
    }
    return next(action);
  };
}
