import { useCallback, useContext, useMemo } from "react";
import { LocationContext, NavigationContext, RouteContext } from "./context";
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
  const { match } = useContext(RouteContext);
  return match.params;
}
