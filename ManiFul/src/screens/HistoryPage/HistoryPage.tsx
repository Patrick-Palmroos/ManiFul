import { View, Text, ScrollView, Button } from 'react-native';
import colors from '../../styles/colors';
import HistoryItem from './components/HistoryItem/HistoryItem';
import { useTransactions } from '../../context/TransactionContext';
import text from '../../styles/text';

const HistoryPage = () => {
  const { transactions } = useTransactions();

  if (!transactions) {
    return (
      <View style={{ backgroundColor: colors.background, flex: 1 }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.background, flex: 1, padding: 20 }}>
      {transactions.length === 0 ? (
        transactions.map((x, i) => (
          <View style={{ marginBottom: 15 }} key={i}>
            <HistoryItem item={x} />
          </View>
        ))
      ) : (
        <View style={{ alignItems: 'center' }}>
          <Text style={text.regular}>No items found</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default HistoryPage;
