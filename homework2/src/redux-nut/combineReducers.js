export function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers);
  return function combination(state = {}, action) {
    let nextState = {};
    let hasChanged = false;
    for (let i = 0; i < reducerKeys.length; i++) {
      const reducerKey = reducerKeys[i];
      const reducer = reducers[reducerKey];
      const previousStateForKey = state[reducerKey];
      const nextStateForKey = reducer(previousStateForKey, action);
      nextState[reducerKey] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    hasChanged = hasChanged || Object.keys(nextState) !== Object.keys(state);

    return hasChanged ? nextState : state;
  };
}
