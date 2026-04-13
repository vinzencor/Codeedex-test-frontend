import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: {
    name: string;
    scope: string;
    permissions: { name: string }[];
  };
  team?: {
    name: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
  hasPermission: (perm: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Using named export and exporting Context.Provider in a wrapper component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.user);
        } catch (error) {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = (newToken: string, user: User) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const hasPermission = (perm: string) => {
    if (!user || !user.role || !user.role.permissions) return false;
    return user.role.permissions.some(p => p.name === perm);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
