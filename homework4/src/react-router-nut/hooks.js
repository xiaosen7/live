import { useCallback, useContext, useMemo } from "react";
import {
  DataRouterStateContext,
  LocationContext,
  NavigationContext,
  RouteContext,
} from "./context";
import matchRoutes from "./matchRoutes";
import renderMatches from "./renderMatches";

export function useRoutes(routes) {
  const location = useLocation();
  const matches = matchRoutes(routes, location.pathname);
  return renderMatches(matches);
}

export function useLocation() {
  return useContext(LocationContext).location;
}

export function useNavigate() {
  const { navigator } = useContext(NavigationContext);
  return useCallback(
    (to, ...args) => {
      if (typeof to === "number") {
        return navigator.go(to, ...args);
      } else {
        return navigator.push(to, ...args);
      }
    },
    [navigator]
  );
}

export function useParams() {
  return useMatch().params;
}

function useRouteContext() {
  return useContext(RouteContext);
}

export function useMatch() {
  const { matches } = useRouteContext();
  return matches[matches.length - 1];
}

export function useRoute() {
  return useMatch().route;
}

export function useLoaderData() {
  const route = useRoute();
  const state = useContext(DataRouterStateContext);
  return state.loaderData[route.id];
}
