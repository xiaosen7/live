import {
  useMemo,
  useReducer,
  useSyncExternalStore,
  useLayoutEffect,
} from "react";
import {DataRouterContext} from "./Context";
import Router from "./Router";
import Routes from "./Routes";

export default function RouterProvider({router}) {
  useSyncExternalStore(
    router.subscribe,
    () => router.state,
    // We have to provide this so React@18 doesn't complain during hydration,
    // but we pass our serialized hydration data into the router so state here
    // is already synced with what the server saw
    () => router.state
  );

  // const [, forceUpdate] = useReducer((x) => x + 1, 0);
  // useLayoutEffect(() => router.subscribe(forceUpdate)[router]);

  let navigator = useMemo(() => {
    return {
      go: (n) => router.navigate(n),
      push: (to, state, opts) =>
        router.navigate(to, {
          state,
        }),
      replace: (to, state, opts) =>
        router.navigate(to, {
          replace: true,
          state,
        }),
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
