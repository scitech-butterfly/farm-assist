import React, { createContext, useContext, useState, useEffect } from "react";
import { registerUser, loginUser } from "./api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

function useProvideAuth() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("fs_user")) || null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(localStorage.getItem("fs_token") || null);

  useEffect(() => {
    if (user) localStorage.setItem("fs_user", JSON.stringify(user));
    else localStorage.removeItem("fs_user");

    if (token) localStorage.setItem("fs_token", token);
    else localStorage.removeItem("fs_token");
  }, [user, token]);

  // --------- REGISTER ------------
  const register = async (form) => {
    try {
      const res = await registerUser(form);
      if (res?.token && res?.user) {
        setUser(res.user);
        setToken(res.token);
        return true;
      } else {
        console.error("Register failed:", res);
        return false;
      }
    } catch (err) {
      console.error("Register error:", err);
      return false;
    }
  };

  // --------- LOGIN ------------
  const login = async (form) => {
    try {
      const res = await loginUser(form);
      if (res?.token && res?.user) {
        setUser(res.user);
        setToken(res.token);
        return true;
      } else {
        console.error("Login failed:", res);
        return false;
      }
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return { user, token, login, register, logout };
}
