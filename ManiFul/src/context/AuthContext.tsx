import React, { createContext, useState, useContext } from 'react';
import * as Keychain from 'react-native-keychain';
import { AuthContextType, AuthCredentials } from '../types/auth';
import axios from 'axios';

import { API_URL, API_KEY } from '@env';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const login = async ({ email, password }: AuthCredentials): Promise<void> => {
    try {
      console.log('API:', API_KEY);
      const response = await axios.post(
        `${API_URL}/auth/token`,
        {
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'BACKEND-API-KEY': API_KEY,
          },
        },
      );

      await Keychain.setGenericPassword(email, response.data);
      setUser(email);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await Keychain.resetGenericPassword();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
