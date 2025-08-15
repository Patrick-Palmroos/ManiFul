import { View, Text, Button } from 'react-native';
import { TransactionData, TransactionItem } from '../../../../types/data';
import styles from './styles';
import { Shadow } from 'react-native-shadow-2';
import { formatDateToDDMMYYYY } from '../../../../utils/date_handling';
import text from '../../../../styles/text';
import { useTransactions } from '../../../../context/TransactionContext';

const HistoryItem = ({ item }: { item: TransactionData }) => {
  const { deleteTransaction } = useTransactions();

  return (
    <Shadow
      distance={5}
      startColor="rgba(0, 4, 29, 0.04)"
      offset={[0, 2]}
      stretch={true}>
      <View style={styles.container}>
        <Text style={text.moneyDark}>{item.total}€</Text>
        <Text style={{ ...text.subtext, fontSize: 16 }}>
          {formatDateToDDMMYYYY(item.date)}
        </Text>
        <Button
          title="delete"
          onPress={() => deleteTransaction(item.id)}
          color={'red'}
        />
      </View>
    </Shadow>
  );
};

export default HistoryItem;
