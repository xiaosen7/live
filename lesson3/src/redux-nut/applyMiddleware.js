export function applyMiddleware(...middlewares) {
  return (createStore) => (reducer) => {
    const store = createStore(reducer);
    let dispatch = store.dispatch;

    // todo 加强dispatch
    const midApi = {
      getState: store.getState,
      dispatch: (action, ...arg) => dispatch(action, ...arg),
    };
    // middlewareChain 是个新的数组，但是他有对于store的读写权限
    const middlewareChain = middlewares.map((middleware) => middleware(midApi));
    // debugger
    dispatch = compose(...middlewareChain)(store.dispatch); // dispatch()\ thunk()\logger\promise()

    return {
      ...store,
      // 加强之后的dispatch（logger dispatch\thunk dispatch/promise dispatch）
      dispatch,
    };
  };
}

function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args) => {
    return a(b(...args));
  });

  // return funcs.reduce(
  //   (a, b) =>
  //     (...args) =>
  //       a(b(...args))
  // );
}
