import {useCallback, useContext, useMemo} from "react";
import {normalizePathname} from "./utils";
import {
  DataRouterStateContext,
  NavigationContext,
  RouteContext,
} from "./Context";
import Outlet from "./Outlet";
import {matchRoutes, matchPath} from "react-router-dom";

export function useRoutes(routes) {
  // ? 以下匹配必须刷新页面才能更新，因为如果 path 变化，想要页面更新，需主动引起
  // let pathname = window.location.pathname;
  // return routes.map((route) => {
  //   let match = pathname === route.path || pathname === "/" + route.path;
  //   return match ? route.element : null;
  // });

  const location = useLocation();

  const pathname = location.pathname;

  const matches = matchRoutes(routes, {pathname});
  return renderMatches(matches);
}

function renderMatches(matches) {
  if (matches == null) {
    return null;
  }

  // const match = matches[0];
  // return match.route.element;
  return matches.reduceRight((outlet, match) => {
    return (
      <RouteContext.Provider
        value={{outlet, matches}}
        children={match.route.element || outlet}
      />
    );
  }, null);
}

// 路由跳转函数
export function useNavigate() {
  const {navigator} = useContext(NavigationContext);
  // return navigator.push;

  const navigate = useCallback(
    (to, options = {}) => {
      if (typeof to === "number") {
        navigator.go(to);
        return;
      }
      (!!options.replace ? navigator.replace : navigator.push)(
        to,
        options.state
      );
    },
    [navigator]
  );

  return navigate;
}

// 路由跳转函数
export function useLocation() {
  const {location} = useContext(NavigationContext);
  return location;
}

export function useOutlet() {
  const {outlet} = useContext(RouteContext);
  return outlet;
}

export function useParams() {
  const {matches} = useContext(RouteContext);

  const routeMatch = matches[matches.length - 1];
  return routeMatch ? routeMatch.params : {};
}

// const DataRouterStateHook = {
//   UseLoaderData: "useLoaderData",
//   // UseActionData = "useActionData",
//   // UseRouteError = "useRouteError",
//   // UseNavigation = "useNavigation",
//   // UseRouteLoaderData = "useRouteLoaderData",
//   // UseMatches = "useMatches",
//   // UseRevalidator = "useRevalidator",
// };

// function useDataRouterState(hookName) {
//   let state = useContext(DataRouterStateContext);
//   return state;
// }

// export function useLoaderData() {
//   let state = useDataRouterState(DataRouterStateHook.UseLoaderData);
//   let routeId = useCurrentRouteId(DataRouterStateHook.UseLoaderData);

//   return state.loaderData[routeId];
// }

export function useMatch(pattern) {
  const {pathname} = useLocation();
  return useMemo(() => matchPath(pattern, pathname), [pathname, pattern]);
}

export function useResolvedPath(to) {
  const {pathname} = useLocation();

  return useMemo(
    () => ({
      pathname: to,
      hash: "",
      search: "",
    }),
    [pathname]
  );
}
