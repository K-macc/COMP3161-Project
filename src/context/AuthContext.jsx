import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  const syncAuth = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setIsAuthenticated(true);
        setRole(payload.role);
      } catch (e) {
        console.error("Invalid token format");
        setIsAuthenticated(false);
        setRole(null);
      }
    } else {
      setIsAuthenticated(false);
      setRole(null);
    }
  };

  useEffect(() => {
    syncAuth();
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, role, setRole, syncAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
