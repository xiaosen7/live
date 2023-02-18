import {normalizePathname} from "./utils";
import {useContext} from "react";
import {NavigationContext, RouterContext} from "./Context";
import {matchRoutes} from "react-router-dom";

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

  console.log(
    "%c [  ]-30",
    "font-size:13px; background:pink; color:#bf2c9f;",
    matches
  );
  return matches.reduceRight((outlet, match) => {
    return (
      <RouterContext.Provider
        value={{outlet, matches}}
        children={match.route.element || outlet}
      />
    );
  }, null);
}

export function useNavigate() {
  const {navigator} = useContext(NavigationContext);
  // todo 详细实现
  return navigator.push;
}

export function useLocation() {
  const {location} = useContext(NavigationContext);
  // todo 详细实现
  return location;
}

export function useOutlet() {
  return useContext(RouterContext).outlet;
}
