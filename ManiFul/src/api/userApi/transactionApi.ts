import * as Keychain from 'react-native-keychain';
import axios from 'axios';

import { API_URL, API_KEY } from '@env';
import { TransactionData } from '../../types/data';

export const fetchAllUserTransactions = async (): Promise<
  TransactionData[] | null
> => {
  const creds = await Keychain.getGenericPassword();
  if (creds) {
    const { password: token } = creds;
    try {
      console.log('token: ', token);
      const response = await axios.get(`${API_URL}/transactions/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'BACKEND-API-KEY': API_KEY,
          Accept: 'application/json',
        },
      });
      console.log('fetch data: ', JSON.stringify(response.data, null, 2));

      return response.data as TransactionData[];
    } catch (error) {
      console.log('Data fetch error:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Token might be expired, force logout
      }
      return null;
    }
  } else {
    return null;
  }
};

export const fetchTransactionWithid = async ({
  id,
}: {
  id: number;
}): Promise<TransactionData | null> => {
  const creds = await Keychain.getGenericPassword();
  if (creds) {
    const { password: token } = creds;
    try {
      console.log('token: ', token);
      const response = await axios.get(`${API_URL}/transactions/getById`, {
        params: { id: id },
        headers: {
          Authorization: `Bearer ${token}`,
          'BACKEND-API-KEY': API_KEY,
          Accept: 'application/json',
        },
      });
      console.log('fetch data: ', JSON.stringify(response.data, null, 2));

      return response.data as TransactionData;
    } catch (error) {
      console.log('Data fetch error:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Token might be expired, force logout
      }
      return null;
    }
  } else {
    return null;
  }
};
