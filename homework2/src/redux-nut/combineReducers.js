export function combineReducers(reducers) {
  return function combination(state = {}, action) {
    let nextState = state;
    for (const namespace in reducers) {
      if (Object.prototype.hasOwnProperty.call(reducers, namespace)) {
        nextState[namespace] = reducers[namespace](state[namespace], action);
      }
    }

    return nextState;
  };
}
