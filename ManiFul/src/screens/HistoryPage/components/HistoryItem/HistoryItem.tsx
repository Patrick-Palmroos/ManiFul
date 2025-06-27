import { View, Text } from 'react-native';
import { TransactionData, TransactionItem } from '../../../../types/data';

const HistoryItem = ({ item }: { item: TransactionData }) => {
  return (
    <View>
      <Text>{item.total}</Text>
    </View>
  );
};

export default HistoryItem;
