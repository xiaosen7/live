// import {createReducer} from "@reduxjs/toolkit";
import createReducer from "./createReducer";

export default function createSlice({name, initialState, reducers}) {
  const reducerNames = Object.keys(reducers);
  const actionsCreators = {};

  // key: value
  // counter/increment : 带引号的reducer
  const sliceCaseReducerByType = {};

  reducerNames.forEach((reducerName) => {
    const type = `${name}/${reducerName}`;
    const maybeReducerWithPrepare = reducers[reducerName];
    actionsCreators[reducerName] = createAction(type);
    sliceCaseReducerByType[type] = maybeReducerWithPrepare;
  });

  // 创建一个reducer
  function buildReducer() {
    return createReducer(initialState, (builder) => {
      for (let key in sliceCaseReducerByType) {
        builder.addCase(key, sliceCaseReducerByType[key]);
      }
    });
  }

  let _reducer;
  return {
    name,
    actions: actionsCreators,
    reducer: (state, action) => {
      if (!_reducer) _reducer = buildReducer();
      return _reducer(state, action);
    },
  };
}

function createAction(type) {
  function actionCreator(...args) {
    return {
      type,
      payload: args[0],
    };
  }

  actionCreator.type = actionCreator;

  return actionCreator;
}
