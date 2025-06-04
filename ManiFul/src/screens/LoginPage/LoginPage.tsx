//LoginPage.tsx
import React from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import styles from './styles';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginPageNavigationProp } from '../../types/navigation';
import * as Keychain from 'react-native-keychain';

//env
import { API_URL, API_KEY } from '@env';

const LoginPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigation = useNavigation<LoginPageNavigationProp>();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
        headers: {
          BACKEND_API_KEY: `${API_KEY}`,
        },
      });
      await Keychain.setGenericPassword(email, response.data.token);
      navigation.navigate('home');
    } catch (error) {
      console.log('Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Username" onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginPage;
