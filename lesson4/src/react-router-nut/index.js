import BrowserRouter from "./BrowserRouter";
import Routes from "./Routes";
import Route from "./Route";
import NavLink from "./NavLink";
import Outlet from "./Outlet";
import Navigate from "./Navigate";
import createBrowserRouter from "./createBrowserRouter";
import RouterProvider from "./RouterProvider";
import {useNavigate, useParams, useMatch, useLocation} from "./hooks";

export {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Outlet,
  useNavigate,
  useParams,
  useLocation,
  useMatch,
  Navigate,
  createBrowserRouter,
  RouterProvider,
};

// !
// 订阅/取消订阅 [] Map Set
// Context 跨组件层级传值 React (缓存参数：useRef、useMemo、useCallback)
// fiber
// Hooks(effect)、实现自定义Hooks(复用逻辑)
