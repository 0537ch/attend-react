import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authManager } from './AuthManager';
import { getSystemToken } from '../api/systemAuth';
import { loginApi } from '../api/authApi';
import type { AuthContextType, UserData } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(authManager.getToken());
  const [user, setUser] = useState<UserData | null>(authManager.getUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authManager.isAuthenticated());

  useEffect(() => {
    const unsubscribe = authManager.subscribe((state) => {
      setToken(state.token);
      setUser(state.user);
      setIsAuthenticated(!!state.token);
    });

    return unsubscribe;
  }, []);

  const login = async (employeeId: string, password: string) => {
    const response = await loginApi(employeeId, password);

    if (!response.token) {
      throw new Error('Validasi gagal: ID atau password salah');
    }

    const systemToken = await getSystemToken();

    const userData: UserData = {
      id: employeeId,
      username: employeeId,
    };

    authManager.setAuth(systemToken, userData, response.expired || null);
  };

  const logout = () => {
    authManager.clearAuth();
  };

  const value: AuthContextType = {
    token,
    user,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
