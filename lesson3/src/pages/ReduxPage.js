import {useLayoutEffect, useReducer} from "react";
import store from "../store";
import {increment, incrementByAmount} from "../store/counterSlice";

// 状态仓库的可以发生的行为： get\set\(取消)订阅
export default function ReduxPage(props) {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const count = store.getState().counter.value;

  useLayoutEffect(() => {
    const unsubscribe = store.subscribe(() => {
      forceUpdate();
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h3>ReduxPage</h3>
      <button onClick={() => store.dispatch(increment())}>add {count}</button>
      <button onClick={() => store.dispatch(incrementByAmount(100))}>
        incrementByAmount {count}
      </button>

      <button
        onClick={() =>
          store.dispatch({type: "counter/increment", payload: 10})
        }>
        自定义 {count}
      </button>
    </div>
  );
}
