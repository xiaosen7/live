import {Component, useEffect, useLayoutEffect, useReducer} from "react";
import store from "../store";

// 状态仓库的可以发生的行为： get\set\(取消)订阅

// export default class ReduxPage extends Component {
//   componentDidMount() {
//     this.unsubscribe = store.subscribe(() => {
//       this.forceUpdate();
//     });
//   }

//   componentWillUnmount() {
//     this.unsubscribe();
//   }
//   add = () => {
//     store.dispatch({type: "ADD"});

//     console.log(
//       "%c [  ]-11",
//       "font-size:13px; background:pink; color:#bf2c9f;",
//       store.getState()
//     );
//   };
//   render() {
//     return (
//       <div>
//         <h3>ReduxPage</h3>
//         <button onClick={this.add}>{store.getState()}</button>
//       </div>
//     );
//   }
// }

export default function ReduxPage(props) {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useLayoutEffect(() => {
    const unsubscribe = store.subscribe(() => {
      forceUpdate();
    });
    return () => unsubscribe();
  }, []);

  const add = () => {
    store.dispatch({type: "ADD"});
  };

  const minus = () => {
    store.dispatch((dispatch, getState) => {
      setTimeout(() => {
        // console.log("now ", getState()); //sy-log
        dispatch({type: "MINUS", payload: 10});
      }, 1000);
    });

    // setTimeout(() => {
    //   store.dispatch({type: "MINUS"});
    // }, 1000);
  };

  const promise = () => {
    store.dispatch(Promise.resolve({type: "ADD", payload: 100}));
  };

  const add2 = () => {
    store.dispatch({type: "ADD2"});
  };

  const minus2 = () => {
    store.dispatch((dispatch, getState) => {
      setTimeout(() => {
        // console.log("now ", getState()); //sy-log
        dispatch({type: "MINUS2", payload: 10});
      }, 1000);
    });

    // setTimeout(() => {
    //   store.dispatch({type: "MINUS"});
    // }, 1000);
  };

  const promise2 = () => {
    store.dispatch(Promise.resolve({type: "ADD2", payload: 100}));
  };

  return (
    <div>
      <h3>ReduxPage</h3>
      <p>count: {store.getState().count}</p>
      <button onClick={add}>add 同步： {store.getState().count}</button>
      <button onClick={minus}>minus 异步：{store.getState().count}</button>
      <button onClick={promise}>promise {store.getState().count}</button>
      <p>---------------------</p>

      <p>count2: {store.getState().count2}</p>
      <button onClick={add2}>add 同步： {store.getState().count2}</button>
      <button onClick={minus2}>minus 异步：{store.getState().count2}</button>
      <button onClick={promise2}>promise {store.getState().count2}</button>
    </div>
  );
}
