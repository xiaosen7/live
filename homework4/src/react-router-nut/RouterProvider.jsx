import { DataRouterContext, DataRouterStateContext } from "./context";
import Router from "./Router";
import {
  useState,
  useLayoutEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import Routes from "./Routes";

export default function RouterProvider({ router }) {
  const state = useSyncExternalStore(router.subscribe, () => router.state);
  // const [state, setState] = useState(router.state);

  // useLayoutEffect(() => router.subscribe(setState), [router]);

  const navigator = useMemo(
    () => ({
      go: (n) => router.navigate(n),
      push: (to, state) => router.navigate(to, { state }),
      replace: (to, state) => router.navigate(to, { replace: true, state }),
    }),
    [router]
  );

  return (
    <DataRouterContext.Provider value={router}>
      <DataRouterStateContext.Provider value={state}>
        <Router navigator={navigator} location={state.location}>
          <Routes />
        </Router>
      </DataRouterStateContext.Provider>
    </DataRouterContext.Provider>
  );
}
