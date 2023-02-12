import { compose } from "./compose";

export function applyMiddleware(...middlewares) {
  return function (createStore, reducer) {
    const store = createStore(reducer);
    let dispatch = store.dispatch;

    const middlewareApi = {
      dispatch: (...args) => dispatch(...args),
      getState: store.getState,
    };

    const middlewareChain = middlewares.map((x) => x(middlewareApi));
    dispatch = compose(...middlewareChain)(dispatch);

    return {
      ...store,
      dispatch,
    };
  };
}
