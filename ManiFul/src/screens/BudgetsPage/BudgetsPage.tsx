import {
  View,
  Text,
  Button,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { fetchAllBudgets } from '../../api/budgetApi';
import colors from '../../styles/colors';
import LinearGradient from 'react-native-linear-gradient';
import { useEffect, useState } from 'react';
import { BudgetType } from '../../types/budgets';
import { isCurrentMonthAndYear } from './helper';
import text from '../../styles/text';
import BudgetItem from './BudgetItem';
import { useBudgets } from '../../context/BudgetContext';

const BudgetsPage = () => {
  const { budgets, refreshBudgets } = useBudgets();
  const [currentBudget, setCurrentBudget] = useState<BudgetType | null>(null);

  useEffect(() => {
    const lol = budgets.filter(b => isCurrentMonthAndYear(b.month, b.year));
    if (lol.length <= 0) return;
    setCurrentBudget(lol[0]);
  }, []);

  useEffect(() => console.log(currentBudget), [currentBudget]);

  if (!budgets) {
    return (
      <View
        style={{
          backgroundColor: colors.background,
          flex: 1,
          alignItems: 'center',
          paddingTop: 40,
        }}>
        <ActivityIndicator size={50} color={colors.highlight} />
        <Text style={text.subtext}>Loading...</Text>
      </View>
    );
  }

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
        <Button title="LÖl getting shits" onPress={refreshBudgets} />
        <View>
          {budgets.map((budget, i) => (
            <BudgetItem key={i} item={budget} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default BudgetsPage;
