import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { API_URL, API_KEY } from '@env';
import * as Keychain from 'react-native-keychain';
import { BudgetPostType, BudgetType } from '../types/budgets';
import { isCurrentMonthAndYear } from '../utils/date_handling';

interface BudgetContextType {
  budgets: BudgetType[];
  currentBudget: BudgetType | null;
  loading: boolean;
  initialLoading: boolean; // only for first load
  error: string | null;
  refreshBudgets: () => Promise<void>;
  getBudgetById: (id: number) => BudgetType | undefined;
  createBudget: (data: BudgetPostType) => Promise<boolean>;
  deleteBudget: (id: number) => Promise<boolean>;
}

const BudgetContext = createContext<BudgetContextType>({
  budgets: [],
  currentBudget: null,
  loading: false,
  initialLoading: false,
  error: null,
  refreshBudgets: async () => {},
  getBudgetById: () => undefined,
  createBudget: async () => false,
  deleteBudget: async () => false,
});

//TODO: IMPORTANT!!! THIS DATA NEEDS TO BE CACHED!
export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [budgets, setBudgets] = useState<BudgetType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [currentBudget, setCurrentBudget] = useState<BudgetType | null>(null);

  const fetchBudgets = async (isInitialLoad = false) => {
    console.log('fetching budgets');
    if (!user) return;

    if (isInitialLoad) {
      console.log('initial budgets loading');
      setInitialLoading(true);
    } else {
      if (!loading) {
        setLoading(true);
      }
    }
    setError(null);

    try {
      const creds = await Keychain.getGenericPassword();
      if (!creds) throw new Error('No credentials found');

      const response = await axios.get(`${API_URL}/budgets/getAll`, {
        headers: {
          Authorization: `Bearer ${creds.password}`,
          'BACKEND-API-KEY': API_KEY,
          Accept: 'application/json',
        },
      });

      setBudgets(response.data as BudgetType[]);
      const currBudget = budgets.filter(b =>
        isCurrentMonthAndYear(b.month, b.year),
      );
      /* TODO: This should be changed later. Some sort of prompt maybe for user. Just
      automatically adding a newBudget without user input is probably gonna be annoying.
      Should still be forced in the app in someway. Cant use the app really without having a
      budget. */
      if (currBudget.length === 0) {
        const repeating = budgets.filter(b => b.repeating);

        const newBudget =
          repeating.length === 0
            ? ({
                active: true,
                budgetTotal: 2000,
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
                repeating: false,
              } as BudgetType)
            : (repeating[0] as BudgetType);

        createBudget(newBudget);
      } else {
        setCurrentBudget(currBudget[0]);
      }
      console.log('success with budgets');
    } catch (err) {
      setError('Failed to fetch budgets');
      console.error('budgets fetch error:', err);
    } finally {
      if (isInitialLoad) {
        setInitialLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  const createBudget = async (data: BudgetPostType) => {
    try {
      setLoading(true);
      const creds = await Keychain.getGenericPassword();
      if (!creds) throw new Error('No credentials found');

      await axios.post(`${API_URL}/budgets/create`, data, {
        headers: {
          Authorization: `Bearer ${creds.password}`,
          'BACKEND-API-KEY': API_KEY,
        },
      });

      await fetchBudgets(false); // Refresh the list
      return true;
    } catch (err) {
      setError('Failed to create a budget');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getBudgetById = (id: number) => {
    return budgets.find(b => b.id === id);
  };

  const deleteBudget = async (id: number) => {
    try {
      setLoading(true);
      const creds = await Keychain.getGenericPassword();
      if (!creds) throw new Error('No credentials found');

      await axios.delete(`${API_URL}/budgets/delete`, {
        params: { id },
        headers: {
          Authorization: `Bearer ${creds.password}`,
          'BACKEND-API-KEY': API_KEY,
        },
      });

      // Optimistically remove from local state
      setBudgets(prev => prev.filter(t => t.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete transaction');
      console.error('Delete error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchBudgets(true);
  }, [user]);

  return (
    <BudgetContext.Provider
      value={{
        budgets,
        currentBudget,
        loading,
        error,
        refreshBudgets: () => fetchBudgets(false),
        getBudgetById,
        createBudget,
        deleteBudget,
        initialLoading,
      }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudgets = () => useContext(BudgetContext);
