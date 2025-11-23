// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  signUp as apiSignUp,
  logIn as apiLogIn,
  logOut as apiLogOut,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    setUser(getCurrentUser());
    setInitializing(false);
  }, []);

  const value = {
    user,
    async signUp(fields) {
      const u = await apiSignUp(fields);
      setUser(u);
    },
    async logIn(fields) {
      const u = await apiLogIn(fields);
      setUser(u);
    },
    logOut() {
      apiLogOut();
      setUser(null);
    },
  };

  if (initializing) return null; // wait until we know if someone is logged in

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
