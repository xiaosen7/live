import { createContext } from "react";

export const NavigationContext = createContext({
  navigator: null,
});
export const LocationContext = createContext({
  location: null,
  action: null,
});
export const RouteContext = createContext({
  outlet: null,
  matches: null,
  match: null,
});
/**
 * 这个context在使用配置式路由时会用到,传递创建后的router
 */
export const DataRouterContext = createContext(null);

export const DataRouterStateContext = createContext({
  /**
   * 存放配置式路由的loader结果
   */
  loaderData: {},
});
