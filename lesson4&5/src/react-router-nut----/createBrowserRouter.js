import {createBrowserHistory} from "history";
import {matchRoutes} from "react-router-dom";

export default function createBrowserRouter(routes) {
  return createRouter({
    routes,
    history: createBrowserHistory(),
  }).initialize();
}

export function createRouter({history, routes}) {
  let dataRoutes = routes;

  let initialMatches = matchRoutes(dataRoutes, history.location);

  let subscribers = new Set();

  let unlistenHistory = null;

  let state = {
    location: history.location,
    matches: initialMatches,
  };
  let router = {
    get state() {
      return state;
    },
    get routes() {
      return dataRoutes;
    },
    subscribe,
    navigate,
    initialize,
    dispose,
  };

  function initialize() {
    unlistenHistory = history.listen(({location}) => {
      const matches = matchRoutes(dataRoutes, location);
      // update state
      state = {
        ...state,
        matches,
        location,
      };
      subscribers.forEach((subscriber) => subscriber(state));
    });

    return router;
  }

  function dispose() {
    if (unlistenHistory) {
      unlistenHistory();
    }
    subscribers.clear();
  }

  function subscribe(fn) {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  }

  function navigate(to, opts) {
    if (typeof to === "number") {
      history.go(to);
      return;
    }
    return history.push(to, opts);
  }

  return router;
}
