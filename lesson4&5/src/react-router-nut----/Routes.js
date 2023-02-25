import {createRoutesFromChildren} from "./createRoutesFromChildren";
import {useRoutes} from "./hooks";
import {useContext} from "react";
import {DataRouterContext} from "./Context";

export default function Routes({children}) {
  const dataRouterContext = useContext(DataRouterContext);

  let routes = dataRouterContext
    ? dataRouterContext.router.routes
    : createRoutesFromChildren(children);

  return useRoutes(routes);
}
