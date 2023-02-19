import { useStore } from "./useStore";
import { useSyncExternalStore, useReducer } from "react";

export function useSelector(selector) {
  const store = useStore();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  // https://beta.reactjs.org/reference/react/useSyncExternalStore#subscribing-to-an-external-store
  useSyncExternalStore(() => store.subscribe(forceUpdate), store.getState);
  return selector(store.getState());
}
