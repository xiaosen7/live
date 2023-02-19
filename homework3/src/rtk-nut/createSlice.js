import { createActionCreator } from "./createActionCreator";
import { createReducer } from "./createReducer";
import { executeBuilderCallback } from "./executeBuilderCallback";

export function createSlice({
  name,
  initialState,
  reducers: maybeReducers = {},
  extraReducers,
}) {
  const reducerKeys = Object.keys(maybeReducers);

  const actions = {};
  const maybeReducersForType =
    typeof extraReducers === "function"
      ? executeBuilderCallback(extraReducers)
      : {};
  reducerKeys.forEach((reducerKey) => {
    const type = `${name}/${reducerKey}`;
    actions[reducerKey] = createActionCreator(type);
    maybeReducersForType[type] = maybeReducers[reducerKey];
  });

  function buildReducer() {
    return createReducer(initialState, (builder) => {
      Object.keys(maybeReducersForType).forEach((type) => {
        builder.addCase(type, maybeReducersForType[type]);
      });
    });
  }

  let _reducer;
  return {
    /**
     * 一些函数，执行后返回 action
     */
    actions,
    /**
     * 一个真正的redux reducer
     */
    reducer(state, action) {
      if (!_reducer) {
        _reducer = buildReducer();
      }

      return _reducer(state, action);
    },
  };
}
