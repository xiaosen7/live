import React, {useContext} from "react";
import {DataRouterContext} from "./Context";
import {useRoutes} from "./hooks";

function createRoutesFromChildren(children) {
  let routes = [];

  React.Children.forEach(children, (child) => {
    // route
    if (!React.isValidElement(child)) {
      return;
    }

    // index
    let route = {element: child.props.element, path: child.props.path};

    // 嵌套路由
    if (child.props.children) {
      route.children = createRoutesFromChildren(child.props.children);
    }

    routes.push(route);
  });

  return routes;
}

export default function Routes({children}) {
  const dataRouterContext = useContext(DataRouterContext);

  const routes = dataRouterContext
    ? dataRouterContext.router.routes
    : createRoutesFromChildren(children);

  return useRoutes(routes);
}
