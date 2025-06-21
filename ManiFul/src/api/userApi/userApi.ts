import * as Keychain from 'react-native-keychain';
import axios from 'axios';

import { API_URL, API_KEY } from '@env';

const fetchUserData = async () => {
  const creds = await Keychain.getGenericPassword();
  if (creds) {
    const { password: token } = creds;
    console.log('fetch user data token:', token);
    try {
      console.log('token: ', token);
      const response = await axios.get(`${API_URL}/users`, {
        params: { id: 1 },
        headers: {
          Authorization: `Bearer ${token}`,
          'BACKEND-API-KEY': API_KEY,
          Accept: 'application/json',
        },
      });
      console.log('user data: ', response.data);
    } catch (error) {
      console.log('User fetch error:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Token might be expired, force logout
      }
    } finally {
      // setIsLoading(false);
    }
  }
};
