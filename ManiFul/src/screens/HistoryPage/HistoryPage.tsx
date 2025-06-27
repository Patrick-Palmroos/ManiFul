import { View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import {
  fetchTransactionWithid,
  fetchAllUserTransactions,
} from '../../api/userApi/transactionApi';
import colors from '../../styles/colors';
import HistoryItem from './components/HistoryItem';
import { TransactionData } from '../../types/data';

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

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Text>History</Text>
    </View>
  );
};

export default HistoryPage;
