import React, { createContext, useState, useEffect } from "react";
import api from "../utils/api";

// PUBLIC_INTERFACE
export const AuthContext = createContext();

/**
 * PUBLIC_INTERFACE
 * AuthProvider wraps the app and manages authentication state, including user object,
 * login/register/logout functions, and modal state for the login/register dialogs.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.auth
      .getProfile()
      .then((u) => {
        if (u) setUser(u);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // called after login
  function onLogin(userData) {
    setUser(userData);
    setShowLogin(false);
  }

  // called after registration
  function onRegister(userData) {
    setUser(userData);
    setShowRegister(false);
  }

  function logout() {
    api.auth
      .logout()
      .catch(() => {})
      .finally(() => setUser(null));
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        showLogin,
        setShowLogin,
        showRegister,
        setShowRegister,
        logout,
        onLogin,
        onRegister,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
