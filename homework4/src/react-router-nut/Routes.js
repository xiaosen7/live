import React from "react";
import {useRoutes} from "./hooks";

function createRoutesFromChildren(children) {
  let routes = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }

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
  const routes = createRoutesFromChildren(children);

  return useRoutes(routes);
}
