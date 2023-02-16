import {
  createContext,
  useContext,
  useReducer,
  useLayoutEffect,
  useState,
  useCallback,
  useSyncExternalStore,
} from "react";
import {bindActionCreators} from "../redux-nut/";

// 1.createContext
const ReactReduxContext = createContext();

// 2.Provider提供value
export function Provider({store, children}) {
  return <ReactReduxContext.Provider value={store} children={children} />;
}

// 3. 消费value
// contextType
// useContext
// Consumer
export const connect =
  (mapStateToProps = (state) => state, mapDispatchToProps) =>
  (WrapComponent) =>
  (props) => {
    const store = useContext(ReactReduxContext);
    const {getState, dispatch} = store;
    const stateProps = mapStateToProps(getState());
    let dispatchProps = {dispatch};

    if (typeof mapDispatchToProps === "function") {
      dispatchProps = mapDispatchToProps(dispatch);
    } else if (typeof mapDispatchToProps === "object") {
      dispatchProps = bindActionCreators(mapDispatchToProps, dispatch);
    }

    // const [, forceUpdate] = useReducer((x) => x + 1, 0);

    // const [, forceUpdate] = useState({});

    const forceUpdate = useForceUpdate();

    // _DOM变更_  _effect_  useEffect
    useLayoutEffect(() => {
      const unsubscribe = store.subscribe(() => {
        forceUpdate({});
      });
      return unsubscribe;
    }, [store]);

    // todo 往 WrapComponent 上加props
    return <WrapComponent {...props} {...stateProps} {...dispatchProps} />;
  };

function useForceUpdate() {
  const [state, setState] = useState(0);
  const update = useCallback(() => {
    setState((prev) => prev + 1);
  }, []);

  return update;
}

export function useSelector(selector) {
  const store = useContext(ReactReduxContext);

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const state = useSyncExternalStore(() => {
    store.subscribe(forceUpdate);
  }, store.getState);

  const selectedState = selector(state);

  return selectedState;
}

export function useDispatch() {
  const store = useContext(ReactReduxContext);
  return store.dispatch;
}
