//App.tsx
import React from 'react';

import LoginPage from './src/screens/LoginPage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/types/navigation';
import { enableScreens } from 'react-native-screens';
import HomePage from './src/screens/HomePage';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigation from './src/navigation/RootNavigation';

enableScreens();

const Stack = createNativeStackNavigator<RootStackParamList>();

import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
