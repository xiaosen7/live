import {BrowserRouter, Routes, Route} from "./which";
import AboutLazy from "./pages/AboutLazy";
import Home from "./pages/Home";
import NoMatch from "./pages/NoMatch";
import Layout from "./layouts/Layout";

// 组件式路由
export default function App(props) {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="about" element={<AboutLazy />} />
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
