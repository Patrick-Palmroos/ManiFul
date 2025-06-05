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
import { useAuth } from '../../context/AuthContext';

//env
import { API_URL, API_KEY } from '@env';

const LoginPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigation = useNavigation<LoginPageNavigationProp>();
  const { login, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    await login({ email, password });
    navigation.navigate('home');
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
