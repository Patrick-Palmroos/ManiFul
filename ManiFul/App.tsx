//App.tsx
import React from 'react';

import { AuthProvider } from './src/context/AuthContext';
import RootNavigation from './src/navigation/RootNavigation';
import { ModalProvider } from './src/context/ModalContext';
import { TypesProvider } from './src/context/TypesContext';
import { TransactionProvider } from './src/context/TransactionContext';
import { BudgetProvider } from './src/context/BudgetContext';
import FlashMessage from 'react-native-flash-message';
import { useAuth } from './src/context/AuthContext';
import { useTransactions } from './src/context/TransactionContext';
import { useTypes } from './src/context/TypesContext';
import { useBudgets } from './src/context/BudgetContext';
import LoadingScreen from './src/screens/LoadingScreen';

import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

const AppContent = () => {
  const { loading: authLoading } = useAuth();
  const { initialLoading: transactionLoading } = useTransactions();
  const { initialLoading: typesLoading } = useTypes();
  const { initialLoading: budgetLoading } = useBudgets();

  if (transactionLoading || typesLoading || authLoading || budgetLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <ModalProvider>
        <RootNavigation />
      </ModalProvider>
      <FlashMessage position="top" style={{ zIndex: 1000 }} />
    </>
  );
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <AuthProvider>
      <TypesProvider>
        <TransactionProvider>
          <BudgetProvider>
            <AppContent />
          </BudgetProvider>
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
