"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import * as authApi from "../api";
import type { User } from "../types";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_STORAGE_KEY = "apparel-ec:token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

    const resolveUser = storedToken
      ? authApi.fetchCurrentUser(storedToken).catch(() => {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          return null;
        })
      : Promise.resolve(null);

    resolveUser.then((fetchedUser) => {
      if (isCancelled) return;
      setUser(fetchedUser);
      setToken(fetchedUser ? storedToken : null);
      setIsLoading(false);
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  async function login(email: string, password: string) {
    const response = await authApi.login(email, password);
    localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
    setToken(response.token);
    setUser(response.user);
  }

  async function register(name: string, email: string, password: string) {
    const response = await authApi.register(name, email, password);
    localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
    setToken(response.token);
    setUser(response.user);
  }

  async function logout() {
    if (token) {
      await authApi.logout(token);
    }
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthはAuthProviderの内側で使用してください");
  }

  return context;
}
