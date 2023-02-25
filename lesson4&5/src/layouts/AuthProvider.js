import React, {useContext} from "react";
import {Navigate, Outlet, useLocation} from "../which";
import {fakeAuthProvider} from "./auth";

const AuthContext = React.createContext();

export default function AuthProvider({children}) {
  let [user, setUser] = React.useState(null);

  let signin = (newUser, callback) => {
    return fakeAuthProvider.signin(() => {
      setUser(newUser);
      callback();
    });
  };

  let signout = (callback) => {
    return fakeAuthProvider.signout(() => {
      setUser(null);
      callback();
    });
  };

  let value = {user, signin, signout};

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 权限组件
export function RequireAuth({children}) {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.user) {
    return <Navigate to="/login" state={{from: location}} replace />;
  }

  return children;
}

export function useAuth() {
  return useContext(AuthContext);
}
