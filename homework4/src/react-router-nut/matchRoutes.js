import { matchRoutes as _matchRoutes } from "react-router-dom";

export default function matchRoutes(routes, pathname) {
  return _matchRoutes(routes, { pathname });
}
