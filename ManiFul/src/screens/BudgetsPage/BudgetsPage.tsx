import { View, Text, Button } from 'react-native';
import { fetchAllBudgets } from '../../api/budgetApi';

const BudgetsPage = () => {
  const getThemLol = async () => {
    const res = await fetchAllBudgets();
    console.log(res);
  };

  return (
    <View>
      <Text>Budgets</Text>
      <Button title="LÖl getting shits" onPress={getThemLol} />
    </View>
  );
};

export default BudgetsPage;
