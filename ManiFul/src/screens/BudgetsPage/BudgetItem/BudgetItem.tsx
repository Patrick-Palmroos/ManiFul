import { Text, TouchableOpacity, View, Button } from 'react-native';
import { BudgetType } from '../../../types/budgets';
import { useTransactions } from '../../../context/TransactionContext';
import { useEffect, useState } from 'react';
import { TransactionData } from '../../../types/data';
import { Shadow } from 'react-native-shadow-2';
import { useBudgets } from '../../../context/BudgetContext';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const BudgetItem = ({ item }: { item: BudgetType }) => {
  const { transactions } = useTransactions();
  const { deleteBudget } = useBudgets();
  const [monthsTransactions, setMonthsTransactions] = useState<
    TransactionData[] | null
  >(null);

  const filterTransactionsByMonth = () => {
    const data = transactions.filter(
      t => new Date(t.date).getMonth() + 1 === item.month,
    );
    if (data.length === 0) return;
    setMonthsTransactions(data);
  };

  useEffect(() => filterTransactionsByMonth(), []);

  return (
    <Shadow
      distance={5}
      startColor="rgba(0, 4, 29, 0.01)"
      offset={[0, 2]}
      stretch={true}>
      <View
        style={{
          backgroundColor: 'white',
          margin: 5,
          height: 170,
          padding: 5,
          borderRadius: 10,
        }}>
        {/* Date */}
        <Text>
          {item.year} {months[item.month - 1]}
        </Text>
        {/* Months expenses */}
        <Text>
          {monthsTransactions
            ? monthsTransactions.reduce((sum, item) => sum + item.total, 0)
            : 'no expenses found'}
          /{item.budgetTotal} €
        </Text>
        <Button title="delete" onPress={() => deleteBudget(item.id)} />
        <Button title="edit" onPress={() => deleteBudget(item.id)} />
      </View>
    </Shadow>
  );
};

export default BudgetItem;
