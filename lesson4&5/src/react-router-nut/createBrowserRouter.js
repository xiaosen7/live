import {createBrowserHistory} from "history";
import {matchRoutes} from "react-router-dom";

export default function createBrowserRouter(routes) {
  return createRouter({history: createBrowserHistory(), routes}).initialize();
}

// 存储订阅事件 [], Map , Set
export function createRouter({history, routes}) {
  let state = {
    location: history.location,
    matches: matchRoutes(routes, history.location),
  };

  // 存储订阅事件
  let subscribers = new Set();

  const router = {
    get state() {
      return state;
    },

    get routes() {
      return routes;
    },
    navigate,
    subscribe,
    initialize,
    dispose,
  };

  let historyUnListen;
  function initialize() {
    historyUnListen = history.listen(({location}) => {
      const matches = matchRoutes(routes, location);
      state = {...state, location, matches};

      subscribers.forEach((subscriber) => subscriber(state));
    });
    return router;
  }

  function dispose() {
    if (historyUnListen) {
      historyUnListen();
    }
    subscribers.clear();
  }

  function navigate(to, opts = {}) {
    if (typeof to === "number") {
      history.go(to);
    }

    return (!!opts.replace ? history.replace : history.push)(to, opts.state);
  }

  function subscribe(fn) {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  }

  return router;
}
