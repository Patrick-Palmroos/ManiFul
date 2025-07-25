//App.tsx
import React from 'react';

import { AuthProvider } from './src/context/AuthContext';
import RootNavigation from './src/navigation/RootNavigation';
import { ModalProvider } from './src/context/ModalContext';
import { TypesProvider } from './src/context/TypesContext';
import { TransactionProvider } from './src/context/TransactionContext';
import FlashMessage from 'react-native-flash-message';

import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <AuthProvider>
      <TypesProvider>
        <TransactionProvider>
          <ModalProvider>
            <RootNavigation />
            <FlashMessage />
          </ModalProvider>
        </TransactionProvider>
      </TypesProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
