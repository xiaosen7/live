import { matchRoutes } from "react-router-dom";

export default function createRouter({ history, routes }) {
  routes = enhanceRoutes(routes);

  let router = null;

  let state = {
    location: history.location,
    loaderData: {},
    matches: [],
  };

  const subscribers = new Set();

  let unlistenHistory = null;

  function initialize() {
    unlistenHistory = history.listen(({ action, location }) => {
      updateState({
        ...state,
        action,
        location,
      });

      subscribers.forEach((subscriber) => subscriber(state));
    });

    startNavigation(history.location.pathname, {});
    return router;
  }

  function dispose() {
    if (unlistenHistory) {
      unlistenHistory();
    }

    subscribers.clear();
    state = null;
  }

  function subscribe(fn) {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  }

  function navigate(to, opts) {
    if (typeof to === "number") {
      return history.go(to);
    }

    return startNavigation(to, opts);
  }

  async function startNavigation(to, opts) {
    const matches = matchRoutes(routes, { pathname: to });
    const loaderData = await handleLoaders(matches);
    const newState = {
      ...state,
      loaderData,
      matches,
    };
    completeNavigation(to, opts, newState);
  }

  function completeNavigation(to, opts, newState) {
    updateState(newState);
    opts?.replace
      ? history.replace(to, opts?.state)
      : history.push(to, opts?.state);
  }

  async function handleLoaders(matches) {
    const loaderData = {};

    const mapper = async ({ route }) => {
      if (!route.loader) {
        return;
      }

      const data = await route.loader();
      loaderData[route.id] = data;
    };
    await Promise.all(matches.map(mapper));

    return loaderData;
  }

  function updateState(newState) {
    state = {
      ...state,
      ...newState,
    };
  }

  router = {
    routes,
    history,
    navigate,
    get state() {
      return state;
    },
    subscribe,
    dispose,
    initialize,
  };

  return router;
}

/**
 * 给route增加id属性
 * @param {*} routes
 * @returns
 */
function enhanceRoutes(routes) {
  function _enhanceRoutes(routes, parentPath) {
    return routes.map((route, index) => {
      const newRoute = { ...route };

      const treePath = [...parentPath, index];
      const id = route.id ?? treePath.join("-");
      newRoute.id = id;

      if (newRoute.children) {
        newRoute.children = _enhanceRoutes(newRoute.children, treePath);
      }

      return newRoute;
    });
  }

  return _enhanceRoutes(routes, []);
}
