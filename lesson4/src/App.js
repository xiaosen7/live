import {BrowserRouter, Routes, Route} from "./which";
import AboutLazy from "./pages/AboutLazy";
import Home from "./pages/Home";
import NoMatch from "./pages/NoMatch";
import Layout from "./layouts/Layout";
import Product from "./pages/Product";
import ProductDetail from "./pages/ProductDetail";
import User from "./pages/User";
import AuthProvider, {RequireAuth} from "./layouts/AuthProvider";
import Login from "./pages/Login";

// 组件式路由
export default function App(props) {
  return (
    <div className="app">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="about" element={<AboutLazy />} />
              <Route path="product" element={<Product />}>
                <Route path=":id" element={<ProductDetail />} />
              </Route>
              <Route path="*" element={<NoMatch />} />

              <Route
                path="user"
                element={
                  <RequireAuth>
                    <User />
                  </RequireAuth>
                }
              />
              <Route path="login" element={<Login />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

// product/:id
// product/123
