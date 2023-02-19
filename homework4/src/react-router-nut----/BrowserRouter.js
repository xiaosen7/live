import {useState, useRef, useLayoutEffect} from "react";
import {createBrowserHistory} from "history";
import Router from "./Router";

export default function BrowserRouter({children}) {
  // 组件卸载之前用
  let historyRef = useRef();

  if (historyRef.current == null) {
    historyRef.current = createBrowserHistory();
  }

  const history = historyRef.current;

  const [state, setState] = useState({location: history.location});

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router children={children} navigator={history} location={state.location} />
  );
}
