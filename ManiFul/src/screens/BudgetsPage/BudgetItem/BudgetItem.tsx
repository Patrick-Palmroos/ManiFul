import { Text, View } from 'react-native';
import { BudgetType } from '../../../types/budgets';

const BudgetItem = ({ item }: { item: BudgetType }) => {
  return (
    <View>
      <Text>Item: {item.month}</Text>
    </View>
  );
};

export default BudgetItem;
