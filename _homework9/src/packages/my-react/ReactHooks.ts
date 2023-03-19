import { Dispatcher } from "my-shared/ReactInternalTypes";
import { ReactCurrentDispatcher } from "./ReactCurrentDispatcher";

export function useState(initialState: any) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}

export function useReducer(
  reducer: (state: any, action: any) => any,
  initialState: any
) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useReducer(reducer, initialState);
}

/**
 * 在组件执行前会将ReactCurrentDispatcher.current设置值
 * 执行后会把ReactCurrentDispatcher.current置为null
 * 这样就可以检查hooks上下文是不是在函数组件内部
 * @returns
 */
function resolveDispatcher() {
  const dispatcher = ReactCurrentDispatcher.current;
  if (dispatcher === null) {
    console.error(
      "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for" +
        " one of the following reasons:\n" +
        "1. You might have mismatching versions of React and the renderer (such as React DOM)\n" +
        "2. You might be breaking the Rules of Hooks\n" +
        "3. You might have more than one copy of React in the same app\n" +
        "See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem."
    );
  }

  // Will result in a null access error if accessed outside render phase. We
  // intentionally don't throw our own error because this is in a hot path.
  // Also helps ensure this is inlined.
  return dispatcher as Dispatcher;
}
