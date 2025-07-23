import { Category, Type } from '../types/categories';
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import * as Keychain from 'react-native-keychain';

import { API_URL, API_KEY } from '@env';

interface TypeContextType {
  categories: Category[];
  types: Type[];
  loading: boolean;
  initialLoading: boolean; // only for first load
  error: string | null;
  refreshData: () => Promise<void>;
}

const TypeContext = createContext<TypeContextType>({
  categories: [],
  types: [],
  loading: false,
  initialLoading: false,
  error: null,
  refreshData: async () => {},
});

export const TypesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const { isAuthenticated, token, initialized } = useAuth();

  const fetchData = async (isInitialLoad = false): Promise<boolean> => {
    if (!isAuthenticated || !token || !initialized) return false;

    try {
      if (isInitialLoad) {
        setInitialLoading(true);
      } else {
        if (!loading) {
          setLoading(true);
        }
      }
      setError(null);

      // Fetch both categories and types in parallel
      const [categoriesRes, typesRes] = await Promise.all([
        axios.get(`${API_URL}/api/categories/getAll`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'BACKEND-API-KEY': API_KEY,
          },
        }),
        axios.get(`${API_URL}/api/types/getAll`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'BACKEND-API-KEY': API_KEY,
          },
        }),
      ]);

      setCategories(categoriesRes.data);
      setTypes(typesRes.data);
      return true;
    } catch (err) {
      setError('Error fetching types and categories');
      console.error('Type fetch error:', err);
      return false;
    } finally {
      if (isInitialLoad) {
        setInitialLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Initial fetch on mount and when user changess
  useEffect(() => {
    fetchData(true);
  }, [isAuthenticated, token, initialized]);

  return (
    <TypeContext.Provider
      value={{
        categories,
        error,
        types,
        loading,
        initialLoading,
        refreshData: () => fetchData(false),
      }}>
      {children}
    </TypeContext.Provider>
  );
};

export const useTypes = () => useContext(TypeContext);
