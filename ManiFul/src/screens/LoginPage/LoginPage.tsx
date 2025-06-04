//LoginPage.tsx
import React from 'react';
import {View, Text} from 'react-native';
import styles from './styles';
import {useState, useEffect} from 'react';

//env
import {API_URL, API_KEY} from '@env';

const LoginPage = () => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_URL}/users?id=1`, {
        method: 'GET',
        headers: {
          'BACKEND-API-KEY': `${API_KEY}`,
        },
      });
      if (response.status === 401) {
        throw new Error('Unauthorized: Missing or invalid API key');
      }
      if (!response.ok)
        throw new Error(`Error fetching user: ` + response.status);
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Login page</Text>
      {user ? (
        <>
          <Text>ID: {user.id}</Text>
        </>
      ) : (
        <Text>Loading user data...</Text>
      )}
    </View>
  );
};

export default LoginPage;
