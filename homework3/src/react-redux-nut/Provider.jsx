import { context } from "./context";

export function Provider({ store, children }) {
  return <context.Provider value={store} children={children}/>;
}
