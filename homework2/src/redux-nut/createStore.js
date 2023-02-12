export function createStore(reducer, enhancer) {
  if (enhancer) {
    return enhancer(createStore, reducer);
  }

  let currentState;
  let currentSubscriptions = new Map();

  function dispatch(action) {
    currentState = reducer(currentState, action);

    const subscriptions = currentSubscriptions.values();
    Array.from(subscriptions).forEach((fn) => fn());
  }

  function getState() {
    return currentState;
  }

  let id = 0;
  function subscribe(onStoreUpdate) {
    const currentId = id;
    currentSubscriptions.set(currentId, onStoreUpdate);

    id += 1;
    return () => {
      currentSubscriptions.delete(currentId);
    };
  }

  dispatch({ type: "$$REDUX_INIT" });

  return {
    dispatch,
    getState,
    subscribe,
  };
}
