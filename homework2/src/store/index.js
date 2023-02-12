import isPromise from "is-promise";
// import {createStore, applyMiddleware, combineReducers} from "redux";
// import thunk from "redux-thunk";
// import logger from "redux-logger";
// import promise from "redux-promise";

import { createStore, applyMiddleware, combineReducers } from "../redux-nut";

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
  combineReducers({ count: countReducer, count2: countReducer2 }),
  applyMiddleware(thunk, promise, logger)
);

function logger(api) {
  return (next) => (action) => {
    const prevState = api.getState();
    console.log("prevState", prevState);

    next(action);

    const nextState = api.getState();
    console.log("currentState", nextState);
  };
}

function thunk(api) {
  return (next) => (action) => {
    if (typeof action === "function") {
      action();
    } else {
      next(action);
    }
  };
}

function promise() {
  return (next) => (action) => {
    if (action instanceof Promise) {
      action.then(next);
    } else {
      next(action);
    }
  };
}

export default store;
