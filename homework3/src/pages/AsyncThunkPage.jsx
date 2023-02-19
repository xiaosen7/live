import { useLayoutEffect, useReducer } from "react";
import store from "../store";
import { thunkActionCreator } from "../store/asyncThunkSlice";

// 状态仓库的可以发生的行为： get\set\(取消)订阅
export default function AsyncThunkPage(props) {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const asyncThunkState = store.getState().asyncThunk;

  useLayoutEffect(() => {
    const unsubscribe = store.subscribe(() => {
      forceUpdate();
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h3>AsyncThunkPage</h3>
      {asyncThunkState.loading ? 'loading' : <>
      <p>数据：{asyncThunkState.data}</p>
      <p>原因：{asyncThunkState.reason}</p>
      </>}
      
      <button
        onClick={() =>
          store.dispatch(thunkActionCreator(false))
        }
      >
        发起一个请求，响应失败
      </button>

      <button
        onClick={() =>
          store.dispatch(thunkActionCreator(true))
        }
      >
        发起一个请求，响应成功
      </button>

      <button
        onClick={() => {
            const thunkFunction = thunkActionCreator(false);
            const promise = store.dispatch(thunkFunction);
            setTimeout(() => {
                promise.abort('因为某些原因终止请求');
            }, 200)
        }
          
        }
      >
        发起一个请求，中途拒绝
      </button>
    </div>
  );
}
