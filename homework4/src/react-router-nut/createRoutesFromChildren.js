import React from "react";

export default function createRoutesFromChildren(children) {
  const routes = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }

    const route = {
      path: child.props.path,
      element: child.props.element,
      id: Math.random().toString(32).slice(2),
    };

    if (child.props.children) {
      route.children = createRoutesFromChildren(child.props.children);
    }

    routes.push(route);
  });

  return routes;
}
