import { Text, View, Button, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import * as Keychain from 'react-native-keychain';
import axios from 'axios';
import { HomePageNavigationProp } from '../../types/navigation';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

import { API_URL, API_KEY } from '@env';

type UserData = {
  id: number;
  // Add other user properties as needed
};

const HomePage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigation = useNavigation<HomePageNavigationProp>();
  const { user, logout } = useAuth();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const creds = await Keychain.getGenericPassword();
        if (creds) {
          // You might want to verify the token is still valid here
          await fetchUserData();
        }
      } catch (error) {
        console.error('Keychain access error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const fetchUserData = async () => {
    const creds = await Keychain.getGenericPassword();
    if (creds) {
      const { password: token } = creds;
      console.log('fetch user data token:', token);
      try {
        console.log('token: ', token);
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/users`, {
          params: { id: 1 },
          headers: {
            Authorization: `Bearer ${token}`,
            'BACKEND-API-KEY': API_KEY,
            Accept: 'application/json',
          },
        });
        console.log('user data: ', response.data);
        setUserData(response.data);
      } catch (error) {
        console.log('User fetch error:', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          // Token might be expired, force logout
          await handleLogout();
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await logout();
      navigation.navigate('landingPage'); // Assuming your login screen is named 'Login'
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {user ? (
        <View style={{ gap: 16 }}>
          <Text>Welcome {user}!</Text>
          {userData && <Text>User ID: {userData.id}</Text>}
          <Button
            title="Refresh User Data"
            onPress={() => user && fetchUserData()}
          />
          <Button title="Logout" onPress={handleLogout} />
        </View>
      ) : (
        <View style={{ gap: 16 }}>
          <Text>Please log in to continue BROTHERRR</Text>
          <Button
            title="Go to Login"
            onPress={() => navigation.navigate('landingPage')}
          />
        </View>
      )}
    </View>
  );
};

export default HomePage;
