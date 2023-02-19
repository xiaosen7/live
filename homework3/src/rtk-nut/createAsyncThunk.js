import { createActionCreator } from "./createActionCreator";

export function createAsyncThunk(typePrefix, payloadCreator) {
  const pending = createActionCreator(`${typePrefix}/pending`);
  const fulfilled = createActionCreator(`${typePrefix}/fulfilled`);
  const rejected = createActionCreator(`${typePrefix}/rejected`);

  function actionCreator(args) {
    // 因为configureStore默认带了thunk中间件，所以可以使用函数类型的action
    return function thunkFunction(dispatch, getState) {
      let abort;
      const dummyPromise = new Promise((_, reject) => {
        abort = reject;
      });

      dispatch(pending());

      const promise = Promise.race([dummyPromise, payloadCreator(args)]).then(
        (x) => dispatch(fulfilled(x)),
        (e) => dispatch(rejected(e))
      );

      return Object.assign(promise, {
        abort,
      });
    };
  }

  return Object.assign(actionCreator, {
    pending,
    fulfilled,
    rejected,
  });
}
