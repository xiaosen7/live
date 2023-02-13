export function createStore(reducer, enhancer) {
  if (enhancer) {
    return enhancer(createStore, reducer);
  }

  let currentState;
  let listeners = new Map();

  function dispatch(action) {
    currentState = reducer(currentState, action);
    listeners.forEach((l) => l());
  }

  function getState() {
    return currentState;
  }

  let countId = 0;
  function subscribe(onStoreUpdate) {
    const currentId = countId;
    listeners.set(currentId, onStoreUpdate);

    countId += 1;
    return () => {
      listeners.delete(currentId);
    };
  }

  dispatch({ type: "$$REDUX_INIT" });

  return {
    dispatch,
    getState,
    subscribe,
  };
}
