import { View, Text, Button, ScrollView } from 'react-native';
import { fetchAllBudgets } from '../../api/budgetApi';
import colors from '../../styles/colors';
import LinearGradient from 'react-native-linear-gradient';
import { useEffect, useState } from 'react';
import { BudgetType } from '../../types/budgets';
import { isCurrentMonthAndYear } from './helper';

const BudgetsPage = () => {
  const [currentBudget, setCurrentBudget] = useState<BudgetType | null>(null);

  const getThemLol = async () => {
    const res = await fetchAllBudgets();
    console.log(res);
    if (res) {
      const lol = res.filter(b => isCurrentMonthAndYear(b.month, b.year));
      if (lol.length <= 0) return;
      setCurrentBudget(lol[0]);
    }
  };

  useEffect(() => {
    getThemLol();
  }, []);

  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      <View style={{ flex: 1, margin: 20 }}>
        <LinearGradient
          colors={[colors.gradient, colors.highlight]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={{
            height: 120,
            width: '100%',
            borderRadius: 10,
          }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text>Current month:</Text>
              <Text>{currentBudget?.budgetTotal}</Text>
              <Text>Edit</Text>
            </View>
            <View>
              <Text>Meter</Text>
            </View>
          </View>
        </LinearGradient>
        <Text>Budgets</Text>
        <Button title="LÖl getting shits" onPress={getThemLol} />
      </View>
    </ScrollView>
  );
};

export default BudgetsPage;
