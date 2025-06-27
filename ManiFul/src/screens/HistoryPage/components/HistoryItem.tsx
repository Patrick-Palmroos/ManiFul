import { View, Text } from 'react-native';
import { TransactionItem } from '../../../types/data';

const HistoryItem = ({ item }: { item: TransactionItem }) => {
  return (
    <View>
      <Text>{item.total}</Text>
    </View>
  );
};

export default HistoryItem;
