import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Keychain from 'react-native-keychain';
import { AuthContextType, AuthCredentials } from '../types/auth';
import { authRes } from '../types/auth';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { User } from '../types/auth';

import { API_URL, API_KEY } from '@env';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadToken = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        try {
          const decoded = jwtDecode(credentials.password);
          setUser(decoded as User);
          console.log('user being set..:', decoded);
        } catch (err) {
          console.log('Token error: ', err);
        }
      }
      setLoading(false);
    };

    if (!user) {
      console.log('no user');
      loadToken();
    } else {
      console.log('user found');
      setLoading(false);
    }
  }, []);

  const login = async ({
    email,
    password,
  }: AuthCredentials): Promise<authRes> => {
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
          timeout: 20000,
        },
      );
      console.log(response);
      await Keychain.setGenericPassword(email, response.data?.token);
      setIsAuthenticated(true);
      const decoded = jwtDecode(response.data?.token);
      setUser(decoded as User);
      setLoading(false);
      return { status: response.status, message: response.statusText };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with a status code (e.g. 401, 500)
          const status = error.response.status;
          const message = error.response.data?.message ?? error.message;

          return { status, message };
        } else if (error.request) {
          // Request was made but no response received

          return { status: 0, message: 'No response from server' };
        } else {
          // Something else happened setting up the request

          return { status: 0, message: error.message };
        }
      } else {
        // Non-Axios error
        console.error('Unexpected error:', error);
        return { status: 0, message: 'Unexpected error' };
      }
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
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, loading }}>
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
