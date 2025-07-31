import * as Keychain from 'react-native-keychain';
import axios from 'axios';

import { API_URL, API_KEY } from '@env';
import { BudgetType } from '../types/budgets';

export const fetchAllBudgets = async (): Promise<BudgetType | null> => {
  try {
    const creds = await Keychain.getGenericPassword();
    if (!creds) return null;
    const { password: token } = creds;
    console.log('token: ', token);
    const response = await axios.get(`${API_URL}/budgets/getAll`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'BACKEND-API-KEY': API_KEY,
        Accept: 'application/json',
      },
    });
    console.log('fetch data: ', JSON.stringify(response.data));

    return response.data as BudgetType;
  } catch (error) {
    console.log('Data fetch error:', error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Token might be expired, force logout
    }
    return null;
  }
};
