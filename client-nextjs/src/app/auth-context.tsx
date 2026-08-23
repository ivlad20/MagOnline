"use client";

import { createContext, useContext, useState, useEffect } from "react";

const authCtx = createContext();

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token as string);
        setIsLoggedIn(true);
        setUsername(decoded.username ?? "User");
      } catch (e) {
        console.error("Invalid token on load", e);
        localStorage.removeItem("token");
      }
    }
  }, []);

  return (
    <authCtx.Provider value={{ isLoggedIn, setIsLoggedIn, username, setUsername }}>
      {children}
    </authCtx.Provider>
  );
}

export function useAuthContext() {
  return useContext(authCtx);
}

// Simple JWT decode utility (alternative to jwt-decode if not installed)
function jwtDecode(token: string): any {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64).split("").map(function (c) {
      return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
    }).join("")
  );
  return JSON.parse(jsonPayload);
}
