import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { api } from '../api';
import { getToken, setToken } from '../api/client';

interface AuthState {
  token: string | null;
  username: string | null;
}

interface AuthContextValue extends AuthState {
  login: (userId: string, username?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => ({ token: getToken(), username: null }));

  const login = useCallback(async (userId: string, username?: string) => {
    try {
      const t = await api.login(userId);
      setToken(t.access_token);
      setState({ token: t.access_token, username: username ?? null });
    } catch {
      setToken(null);
      setState({ token: null, username: username ?? null });
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setState({ token: null, username: null });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}