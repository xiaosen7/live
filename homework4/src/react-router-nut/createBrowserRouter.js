import { createBrowserHistory } from "history";
import createRouter from "./createRouter";

export default function createBrowserRouter(routes) {
  return createRouter({
    history: createBrowserHistory(),
    routes,
  }).initialize();
}
