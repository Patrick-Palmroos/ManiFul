import { View, Text } from 'react-native';
import { TransactionData, TransactionItem } from '../../../../types/data';
import styles from './styles';
import { Shadow } from 'react-native-shadow-2';

const HistoryItem = ({ item }: { item: TransactionData }) => {
  return (
    <Shadow
      distance={4}
      startColor="rgba(0, 0, 0, 0.04)"
      offset={[0, 2]}
      stretch={true}>
      <View style={styles.container}>
        <Text>{item.total}</Text>
      </View>
    </Shadow>
  );
};

export default HistoryItem;
