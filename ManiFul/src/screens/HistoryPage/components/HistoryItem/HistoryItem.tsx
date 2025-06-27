import { View, Text } from 'react-native';
import { TransactionData, TransactionItem } from '../../../../types/data';
import styles from './styles';

const HistoryItem = ({ item }: { item: TransactionData }) => {
  return (
    <View style={styles.container}>
      <Text>{item.total}</Text>
    </View>
  );
};

export default HistoryItem;
