import { View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import {
  fetchTransactionWithid,
  fetchAllUserTransactions,
} from '../../api/userApi/transactionApi';
import colors from '../../styles/colors';
import HistoryItem from './components/HistoryItem';
import { TransactionData } from '../../types/data';
import { TransactionItem } from '../../types/data';

//TODO: save user data into a context for easy access across app without multiple fetches.
const HistoryPage = () => {
  const [transactionData, setTransactionData] = useState<
    TransactionData[] | null
  >(null);

  useEffect(() => {
    const t = async () => {
      const res = await fetchAllUserTransactions();
      if (res) {
        setTransactionData(res);
      } else {
        console.error('ERRROR FETCHING: ', res);
      }
    };

    t();
  }, []);

  if (!transactionData) {
    return (
      <View style={{ backgroundColor: colors.background, flex: 1 }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      {transactionData.map((x, i) => (
        <HistoryItem item={x} key={i} />
      ))}
    </View>
  );
};

export default HistoryPage;
