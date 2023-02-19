import { produce } from "immer";
import { executeBuilderCallback } from "./executeBuilderCallback";

export function createReducer(initialState, builderCallback) {
  const typeToReducerMap = executeBuilderCallback(builderCallback);

  function reducer(state = initialState, action) {
    const reducerForType = typeToReducerMap[action.type];
    if (!reducerForType) {
      return state;
    }

    return produce(state, (proxyForState) => {
      return reducerForType(proxyForState, action);
    });
  }

  return reducer;
}
