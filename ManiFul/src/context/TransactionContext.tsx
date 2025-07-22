import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { API_URL, API_KEY } from '@env';
import * as Keychain from 'react-native-keychain';
import { TransactionData } from '../types/data';
import { transactionPost } from '../types/data';

interface TransactionContextType {
  transactions: TransactionData[];
  loading: boolean;
  initialLoading: boolean; // only for first load
  error: string | null;
  refreshTransactions: () => Promise<void>;
  getTransactionById: (id: number) => TransactionData | undefined;
  createTransaction: (data: transactionPost) => Promise<boolean>;
  deleteTransaction: (id: number) => Promise<boolean>;
}

const TransactionContext = createContext<TransactionContextType>({
  transactions: [],
  loading: false,
  initialLoading: true,
  error: null,
  refreshTransactions: async () => {},
  getTransactionById: () => undefined,
  createTransaction: async () => false,
  deleteTransaction: async () => false,
});

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  const fetchTransactions = async (isInitialLoad = false) => {
    if (!user) return;

    if (isInitialLoad) {
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

      const response = await axios.get(`${API_URL}/transactions/getAll`, {
        headers: {
          Authorization: `Bearer ${creds.password}`,
          'BACKEND-API-KEY': API_KEY,
        },
      });

      setTransactions(response.data);
    } catch (err) {
      setError('Failed to fetch transactions');
      console.error('Transaction fetch error:', err);
    } finally {
      if (isInitialLoad) {
        setInitialLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  const createTransaction = async (data: transactionPost) => {
    try {
      setLoading(true);
      const creds = await Keychain.getGenericPassword();
      if (!creds) throw new Error('No credentials found');

      await axios.post(`${API_URL}/transactions/create`, data, {
        headers: {
          Authorization: `Bearer ${creds.password}`,
          'BACKEND-API-KEY': API_KEY,
        },
      });

      await fetchTransactions(false); // Refresh the list
      return true;
    } catch (err) {
      setError('Failed to create transaction');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getTransactionById = (id: number) => {
    return transactions.find(t => t.id === id);
  };

  const deleteTransaction = async (id: number) => {
    try {
      setLoading(true);
      const creds = await Keychain.getGenericPassword();
      if (!creds) throw new Error('No credentials found');

      await axios.delete(`${API_URL}/transactions/delete`, {
        params: { id },
        headers: {
          Authorization: `Bearer ${creds.password}`,
          'BACKEND-API-KEY': API_KEY,
        },
      });

      // Optimistically remove from local state
      setTransactions(prev => prev.filter(t => t.id !== id));
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
    fetchTransactions(true);
  }, [user]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loading,
        error,
        refreshTransactions: fetchTransactions,
        getTransactionById,
        createTransaction,
        deleteTransaction,
        initialLoading,
      }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);
