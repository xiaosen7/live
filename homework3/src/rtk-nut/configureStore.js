import { createStore, combineReducers, applyMiddleware } from "../redux-nut";
import { thunk } from "../redux-nut/middleware";

export function configureStore({
  reducer,
  middleware = getDefaultMiddleWare(),
}) {
  let finalMiddleware = middleware;
  if (typeof middleware === "function") {
    finalMiddleware = middleware(getDefaultMiddleWare);
  }

  return createStore(
    combineReducers(reducer),
    applyMiddleware(...finalMiddleware)
  );
}

function getDefaultMiddleWare() {
  return [thunk];
}
