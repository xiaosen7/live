import {normalizePathname} from "./utils";
import {useCallback, useContext} from "react";
import {NavigationContext, RouterContext} from "./Context";
import {matchRoutes, matchPath} from "react-router-dom";

// 只有消费了context value的后代组件才需要更新
// 遍历数组，找到要渲染的组件，注意嵌套
export function useRoutes(routes) {
  // let pathname = window.location.pathname;

  // return routes.map((route) => {
  //   let match = pathname === normalizePathname(route.path);
  //   return match ? route.element : null;
  // });

  const location = useLocation();
  const pathname = location.pathname;

  const matches = matchRoutes(routes, {pathname});

  return renderMatches(matches);
}

function renderMatches(matches) {
  if (matches == null) {
    return;
  }

  return matches.reduceRight((outlet, match) => {
    return (
      <RouterContext.Provider
        value={{outlet, matches}}
        children={match.route.element || outlet}
      />
    );
  }, null);
}

// navigate: to(path: string|number)
export function useNavigate() {
  const {navigator} = useContext(NavigationContext);
  // todo 详细实现
  // return navigator.push;

  // go(s) s:number
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

export function useLocation() {
  const {location} = useContext(NavigationContext);
  return location;
}

export function useOutlet() {
  return useContext(RouterContext).outlet;
}

export function useParams() {
  const matches = useContext(RouterContext);
  // 父子，数组的最后一个元素是最后一层
  const routeMatch = matches[matches.length - 1];

  return routeMatch ? routeMatch.params : {};
}

// todo  useParams | useMatch | useResolvedPath

export function useMatch(pattern) {
  const {pathname} = useLocation();
  return matchPath(pattern, pathname);
}

export function useResolvedPath(to) {
  return {
    pathname: to,
  };
}
