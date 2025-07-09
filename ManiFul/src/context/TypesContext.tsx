import { Category, Type } from '../types/categories';
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Assuming you have an auth context

import { API_URL, API_KEY } from '@env';

interface TypeContextType {
  categories: Category[];
  types: Type[];
  loading: boolean;
  refreshData: () => Promise<void>;
}

const TypeContext = createContext<TypeContextType>({
  categories: [],
  types: [],
  loading: false,
  refreshData: async () => {},
});

export const TypesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  const fetchData = async () => {
    if (!user) return;

    setLoading(true);

    try {
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
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount and when user change
  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <TypeContext.Provider
      value={{
        categories,
        types,
        loading,
        refreshData: fetchData,
      }}>
      {children}
    </TypeContext.Provider>
  );
};

export const useTypes = () => useContext(TypeContext);
