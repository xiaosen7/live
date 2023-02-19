export function logger(api) {
  return (next) => (action) => {
    const prevState = api.getState();
    console.log("prevState", prevState);

    next(action);

    const nextState = api.getState();
    console.log("currentState", nextState);
  };
}

export function thunk(api) {
  return (next) => (action) => {
    if (typeof action === "function") {
      return action(api.dispatch, api.getState.bind(api));
    } else {
      return next(action);
    }
  };
}

export function promise() {
  return (next) => (action) => {
    if (action instanceof Promise) {
      action.then(next);
    } else {
      next(action);
    }
  };
}
