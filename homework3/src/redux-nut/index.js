// 创建一个状态仓库
import {applyMiddleware} from "./applyMiddleware";
import {combineReducers} from "./combineReducers";
import {bindActionCreators} from "./bindActionCreators";

export function createStore(reducer, enhancer) {
  // 加强函数
  if (enhancer) {
    return enhancer(createStore)(reducer);
  }

  let currentState;
  let currentListeners = new Map();
  let listenerId = 0;

  function getState() {
    return currentState;
  }
  // redux dispatch 原版dispatch
  function dispatch(action) {
    // 1. 修改状态
    currentState = reducer(currentState, action);
    // 2. 执行监听函数
    currentListeners.forEach((listener) => listener());

    return action;
  }

  function subscribe(listener) {
    currentListeners.set(++listenerId, listener);
    return () => {
      currentListeners.delete(listenerId);
    };
  }

  dispatch({type: "redux/init" + randomString});
  return {
    getState,
    dispatch,
    subscribe,
  };
}

const randomString = () =>
  Math.random().toString(36).substring(7).split("").join(".");

export {applyMiddleware, combineReducers, bindActionCreators};
