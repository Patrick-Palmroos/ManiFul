import { View, Text } from 'react-native';
import { TransactionData, TransactionItem } from '../../../../types/data';
import styles from './styles';
import { Shadow } from 'react-native-shadow-2';
import { formatDateToDDMMYYYY } from '../../helper';

const HistoryItem = ({ item }: { item: TransactionData }) => {
  return (
    <Shadow
      distance={5}
      startColor="rgba(0, 4, 29, 0.04)"
      offset={[0, 2]}
      stretch={true}>
      <View style={styles.container}>
        <Text>{item.total}</Text>
        <Text>{formatDateToDDMMYYYY(item.date)}</Text>
      </View>
    </Shadow>
  );
};

export default HistoryItem;
