"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getToken, saveToken, clearToken } from "@/lib/auth";
import { decodeToken, isTokenExpired } from "@/lib/jwt";
import { getMySellerStatus } from "@/lib/sellers";

interface AuthUser {
  email: string;
  username: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isSeller: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  refreshSellerStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isSeller, setIsSeller] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSellerStatus = useCallback(async () => {
    const status = await getMySellerStatus();
    setIsSeller(status.isSeller);
  }, []);

  const hydrateFromToken = useCallback(
    async (token: string | null) => {
      if (!token) {
        setUser(null);
        setIsSeller(false);
        return;
      }
      const decoded = decodeToken(token);
      if (!decoded || isTokenExpired(decoded)) {
        clearToken();
        setUser(null);
        setIsSeller(false);
        return;
      }
      setUser({ email: decoded.sub, username: decoded.username });
      await refreshSellerStatus();
    },
    [refreshSellerStatus]
  );

  useEffect(() => {
    hydrateFromToken(getToken()).finally(() => setIsLoading(false));
  }, [hydrateFromToken]);

  const login = useCallback(
    (token: string) => {
      saveToken(token);
      hydrateFromToken(token);
    },
    [hydrateFromToken]
  );

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setIsSeller(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isSeller, isLoading, login, logout, refreshSellerStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth trebuie folosit în interiorul AuthProvider");
  return ctx;
}