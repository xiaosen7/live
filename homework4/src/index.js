// import {createRoot} from "react-dom/client";
// import App from "./App";
// // import App from "./App2";
// import "./index.css";

// createRoot(document.getElementById("root")).render(<App />);

// 以下是无框架下的一个路由实现

import { createBrowserHistory } from "history";

const root = document.getElementById("root");

const routes = [
  {
    path: "/",
    name: "首页",
    component: () => `<h1>这是首页内容</h1>`,
  },
  {
    path: "/page1",
    name: "page1",
    component: () => `<h1>这是page1内容</h1>`,
  },
  {
    path: "*",
    name: "404",
    component: () => `<h1>404</h1>`,
  },
];

renderNav();

const container = renderContainer();

const history = createBrowserHistory();
history.listen(historyHandler);

// 页面加载完毕后显示正确的route
historyHandler({ location: history.location, action: history.action });

function renderRoute({ component }) {
  container.innerHTML = component();
}

function renderContainer() {
  const container = document.createElement("main");
  root.append(container);
  return container;
}

function renderNav() {
  const nav = document.createElement("nav");
  routes.forEach(({ path, name }) => {
    if (path === "*") {
      return;
    }

    const link = document.createElement("a");
    link.textContent = name;
    link.href = path;

    link.addEventListener("click", (e) => {
      e.preventDefault();
      history.push(e.target.href);
    });

    nav.append(link);
  });
  root.append(nav);
}

function historyHandler({ action, location }) {
  const route = routes.find(({ path }) => path === location.pathname);
  if (!route) {
    const route404 = routes.find(({ path }) => path === "*");
    if (route404) {
      renderRoute(route404);
    }

    return;
  }

  renderRoute(route);
}
