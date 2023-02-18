import {createRoutesFromChildren} from "./createRoutesFromChildren";
import {useRoutes} from "./hooks";

export default function Routes({children}) {
  let routes = createRoutesFromChildren(children);

  return useRoutes(routes);
}
