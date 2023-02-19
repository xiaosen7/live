import React from "react";

export function createRoutesFromChildren(children) {
  let routes = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }

    let route = {
      element: child.props.element,
      path: child.props.path,
    };

    if (child.props.children) {
      route.children = createRoutesFromChildren(child.props.children);
    }

    routes.push(route);
  });

  return routes;
}
