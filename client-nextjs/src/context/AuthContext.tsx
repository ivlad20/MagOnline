"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getToken, saveToken, clearToken } from "@/lib/auth";
import { decodeToken, isTokenExpired } from "@/lib/jwt";
import { getMySellerStatus } from "@/lib/sellers";
import { getMyProfile } from "@/lib/account";

interface AuthUser {
  email: string;
  username: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isSeller: boolean;
  /** UI hint only; the backend checks admin rights on every /admin request. */
  isAdmin: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  refreshSellerStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isSeller, setIsSeller] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
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
        setIsAdmin(false);
        return;
      }
      const decoded = decodeToken(token);
      if (!decoded || isTokenExpired(decoded)) {
        clearToken();
        setUser(null);
        setIsSeller(false);
        setIsAdmin(false);
        return;
      }
      setUser({ email: decoded.sub, username: decoded.username });
      await Promise.all([
        refreshSellerStatus(),
        getMyProfile()
          .then((p) => setIsAdmin(Boolean(p.admin)))
          .catch(() => setIsAdmin(false)),
      ]);
    },
    [refreshSellerStatus]
  );

  useEffect(() => {
    hydrateFromToken(getToken()).finally(() => setIsLoading(false));
  }, [hydrateFromToken]);

  const login = useCallback(
    (token: string) => {
      saveToken(token);
      // Stay "loading" until the seller status is known, so guarded pages don't redirect on a stale isSeller=false.
      setIsLoading(true);
      hydrateFromToken(token).finally(() => setIsLoading(false));
    },
    [hydrateFromToken]
  );

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setIsSeller(false);
    setIsAdmin(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isSeller, isAdmin, isLoading, login, logout, refreshSellerStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth trebuie folosit în interiorul AuthProvider");
  return ctx;
}