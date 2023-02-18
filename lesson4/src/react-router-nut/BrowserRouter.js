import Router from "./Router";
import {createBrowserHistory} from "history";
import {useLayoutEffect, useRef, useState} from "react";

export default function BrowserRouter({children}) {
  const historyRef = useRef();
  // 要存一个对象，保证在函数组件卸载之前引用不变
  if (!historyRef.current) {
    historyRef.current = createBrowserHistory();
  }

  const history = historyRef.current;

  const [state, setState] = useState({location: history.location});

  useLayoutEffect(() => history.listen(setState), []);

  // useLayoutEffect(() => {
  //   const unlisten = history.listen((location) => {
  //     setState({location});
  //   });
  //   return unlisten;
  // }, []);

  return (
    <Router children={children} location={state.location} navigator={history} />
  );
}
