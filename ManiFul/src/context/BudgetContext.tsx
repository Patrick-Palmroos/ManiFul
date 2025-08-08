import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { API_URL, API_KEY } from '@env';
import * as Keychain from 'react-native-keychain';
import {
  AnyBudget,
  BudgetItemType,
  BudgetPostType,
  BudgetType,
  RepeatingBudget,
} from '../types/budgets';
import { isCurrentMonthAndYear } from '../utils/date_handling';
import { useTypes } from './TypesContext';
import { distributeCategoryTotals } from '../utils/data_handling';

interface BudgetContextType {
  budgets: BudgetType[];
  currentBudget: BudgetType | null;
  defaultBudget: RepeatingBudget | null;
  loading: boolean;
  initialLoading: boolean; // only for first load
  error: string | null;
  refreshBudgets: () => Promise<void>;
  getBudgetById: (id: number) => BudgetType | undefined;
  createBudget: (data: BudgetPostType) => Promise<boolean>;
  updateBudget: (data: BudgetPostType, id: number) => Promise<boolean>;
  deleteBudget: (id: number) => Promise<boolean>;
}

const BudgetContext = createContext<BudgetContextType>({
  budgets: [],
  currentBudget: null,
  defaultBudget: null,
  loading: false,
  initialLoading: false,
  error: null,
  refreshBudgets: async () => {},
  getBudgetById: () => undefined,
  createBudget: async () => false,
  updateBudget: async () => false,
  deleteBudget: async () => false,
});

//TODO: IMPORTANT!!! THIS DATA NEEDS TO BE CACHED!
export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const tempBudgetTotal = 2500;
  const [budgets, setBudgets] = useState<BudgetType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { initialLoading: typesLoading, categories } = useTypes();
  const { user } = useAuth();
  const [initialized, setInitialized] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [currentBudget, setCurrentBudget] = useState<BudgetType | null>(null);
  const [defaultBudget, setDefaultBudget] = useState<RepeatingBudget>({
    active: true,
    budgetTotal: tempBudgetTotal,
    month: null,
    year: null,
    repeating: true,
  } as RepeatingBudget);

  const createBudget = async (data: BudgetPostType): Promise<boolean> => {
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

  const fetchBudgets = async (isInitialLoad = false) => {
    if (!user || loading) return;

    if (isInitialLoad) {
      console.log('initial budgets loading');
      setInitialLoading(true);
      setLoading(true);
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

      const fetchedBudgets = response.data as AnyBudget[];

      setBudgets(fetchedBudgets.filter(b => !b.repeating));
      const currBudget = fetchedBudgets.filter(
        b => !b.repeating && isCurrentMonthAndYear(b.month, b.year),
      );

      function isRepeatingBudget(budget: AnyBudget): budget is RepeatingBudget {
        return budget.repeating === true;
      }

      const repeating: RepeatingBudget[] =
        fetchedBudgets.filter(isRepeatingBudget);

      /* TODO: This should be changed later. Some sort of prompt maybe for user. Just
      automatically adding a newBudget without user input is probably gonna be annoying.
      Should still be forced in the app in someway. Cant use the app really without having a
      budget. */
      let newBudget: BudgetType;
      let shouldCreateDefault = false;
      /* TODO: Also maybe move the hole thing of this bullshittery to account creation and simply
       do not allow a user to not have a default. This way this redicilousness can be removed*/

      if (currBudget.length === 0) {
        if (repeating.length !== 0) {
          //repeating budget found
          newBudget = {
            ...repeating[0],
            active: true,
            budgetTotal: repeating[0].budgetTotal,
            repeating: false,
            items: distributeCategoryTotals(categories, 3000).map(d => ({
              categoryId: d.categoryId,
              typeId: null,
              amount: d.total,
            })),
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
          } as BudgetType;
        } else {
          //no repeating budget found
          newBudget = {
            ...currentBudget,
            active: true,
            budgetTotal: tempBudgetTotal,
            repeating: false,
            items: distributeCategoryTotals(categories, tempBudgetTotal).map(
              d => ({
                categoryId: d.categoryId,
                typeId: null,
                amount: d.total,
              }),
            ),
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
          } as BudgetType;
          shouldCreateDefault = true;
        }
        //create the months budget
        await createBudget(newBudget);
        setCurrentBudget(newBudget);

        //save the repeating if one doesnte exist.
        if (repeating.length > 0) {
          // Use existing repeating budget as default
          setDefaultBudget(repeating[0]);
        } else if (shouldCreateDefault) {
          // Create new default budget
          const newDefault: BudgetPostType = {
            active: true,
            budgetTotal: tempBudgetTotal,
            repeating: true,
            month: null,
            year: null,
            items: distributeCategoryTotals(categories, tempBudgetTotal).map(
              d => ({
                categoryId: d.categoryId,
                typeId: null,
                amount: d.total,
              }),
            ),
          };
          await createBudget(newDefault);
          setDefaultBudget(newDefault as RepeatingBudget);
        }
      } else {
        setCurrentBudget(currBudget[0] as BudgetType);
        if (repeating.length > 0) {
          setDefaultBudget(repeating[0]);
        } else {
          const newDefault: BudgetPostType = {
            active: true,
            budgetTotal: tempBudgetTotal,
            repeating: true,
            month: null,
            year: null,
            items: distributeCategoryTotals(categories, tempBudgetTotal).map(
              d => ({
                categoryId: d.categoryId,
                typeId: null,
                amount: d.total,
              }),
            ),
          };
          await createBudget(newDefault);
          setDefaultBudget(newDefault as RepeatingBudget);
        }
      }

      console.log('success with budgets');
    } catch (err) {
      setError('Failed to fetch budgets');
      console.error('budgets fetch error:', err);
    } finally {
      if (isInitialLoad) {
        setInitialLoading(false);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  const updateBudget = async (
    data: BudgetPostType,
    id: number,
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const creds = await Keychain.getGenericPassword();
      if (!creds) throw new Error('No credentials found');

      await axios.put(`${API_URL}/budgets/update`, data, {
        params: { id },
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
    if (!typesLoading && categories.length > 0 && user && !initialized) {
      setInitialized(true);
      fetchBudgets(true);
    }
  }, [typesLoading, categories, user]);

  return (
    <BudgetContext.Provider
      value={{
        budgets,
        currentBudget,
        defaultBudget,
        loading,
        error,
        refreshBudgets: () => fetchBudgets(false),
        getBudgetById,
        createBudget,
        updateBudget,
        deleteBudget,
        initialLoading,
      }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudgets = () => useContext(BudgetContext);
