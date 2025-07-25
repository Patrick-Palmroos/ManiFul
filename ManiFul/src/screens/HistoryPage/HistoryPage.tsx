import { View, Text, ScrollView, Button } from 'react-native';
import { useEffect, useState } from 'react';
import {
  fetchTransactionWithid,
  fetchAllUserTransactions,
} from '../../api/transactionApi';
import colors from '../../styles/colors';
import HistoryItem from './components/HistoryItem/HistoryItem';
import { TransactionData } from '../../types/data';
import { TransactionItem } from '../../types/data';
import { useTransactions } from '../../context/TransactionContext';
import { useTypes } from '../../context/TypesContext';
//TODO: save user data into a context for easy access across app without multiple fetches
const HistoryPage = () => {
  const { transactions, refreshTransactions } = useTransactions();
  const { types, refreshData } = useTypes();

  const fetchAll = async () => {
    console.log('fetching transactions...');
    await refreshTransactions();
    console.log('done');
  };

  const getTypes = async () => {
    console.log('getting types');
    await refreshData();
    console.log('done: ', types);
  };

  if (!transactions) {
    return (
      <View style={{ backgroundColor: colors.background, flex: 1 }}>
        <Button title="fetch" onPress={fetchAll} />
        <Button title="fetch types" onPress={getTypes} />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.background, flex: 1, padding: 20 }}>
      <Button title="fetch" onPress={fetchAll} />
      <Button title="fetch types" onPress={getTypes} />
      {transactions.map((x, i) => (
        <View style={{ marginBottom: 15 }} key={i}>
          <HistoryItem item={x} />
        </View>
      ))}
    </ScrollView>
  );
};

export default HistoryPage;
