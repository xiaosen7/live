import createNextState from "immer";

export default function createReducer(initialState, callback) {
  const [actionsMap] = builderCallback(callback);

  function reducer(state = initialState, action) {
    const caseReducers = [actionsMap[action.type]];

    return caseReducers.reduce((previousState, caseReducer) => {
      if (caseReducer) {
        return createNextState(previousState, (draft) => {
          return caseReducer(draft, action);
        });
      }

      return previousState;
    }, state);
  }

  return reducer;
}

function builderCallback(callback) {
  const actionsMap = {};

  const builder = {
    addCase: (type, reducer) => {
      actionsMap[type] = reducer;

      return builder;
    },
  };
  callback(builder);
  return [actionsMap];
}
