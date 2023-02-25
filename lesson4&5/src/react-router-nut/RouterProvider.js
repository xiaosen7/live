import Router from "./Router";
import Routes from "./Routes";
import {
  useLayoutEffect,
  useMemo,
  useReducer,
  useSyncExternalStore,
} from "react";
import {DataRouterContext} from "./Context";

// 1. navigator\location
// 2. Routes 的children
export default function RouterProvider({router}) {
  const state = useSyncExternalStore(
    router.subscribe,
    () => router.state,
    () => router.state
  );

  // const [, forceUpdate] = useReducer((x) => x + 1, 0);
  // useLayoutEffect(() => router.subscribe(forceUpdate), [router]);

  let navigator = useMemo(() => {
    return {
      go: (n) => router.navigate(n),
      push: (to, state, opts) => {
        router.navigate(to, state, opts);
      },
      replace: (to, state, opts) => {
        router.navigate(to, {replace: true, ...state}, opts);
      },
    };
  }, [router]);

  return (
    <DataRouterContext.Provider value={{router, navigator}}>
      <Router location={router.state.location} navigator={navigator}>
        <Routes />
      </Router>
    </DataRouterContext.Provider>
  );
}
