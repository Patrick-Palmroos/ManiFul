import {
  View,
  Text,
  Button,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { fetchAllBudgets } from '../../api/budgetApi';
import colors from '../../styles/colors';
import LinearGradient from 'react-native-linear-gradient';
import { useEffect, useState } from 'react';
import { BudgetType } from '../../types/budgets';
import { isCurrentMonthAndYear } from '../../utils/date_handling';
import text from '../../styles/text';
import BudgetItem from './BudgetItem';
import { useBudgets } from '../../context/BudgetContext';
import { useModalContext } from '../../context/ModalContext';
import AddBudgetModal from './AddBudgetModal';
import { useTransactions } from '../../context/TransactionContext';
import { TransactionData } from '../../types/data';
import SpeedometerChart from '../../components/SpeedometerChart';

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

const BudgetsPage = () => {
  const { budgets, refreshBudgets } = useBudgets();
  const [currentBudget, setCurrentBudget] = useState<BudgetType | null>(null);
  const { transactions } = useTransactions();
  const { openModal, closeModal } = useModalContext();

  const screenWidth = Dimensions.get('window').width;
  const chartRadius = screenWidth * 0.15;

  useEffect(() => {
    const current = budgets.filter(b => isCurrentMonthAndYear(b.month, b.year));
    if (current.length <= 0) return;
    setCurrentBudget(current[0]);
  }, []);

  //debug
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
    <View style={{ backgroundColor: colors.background, flex: 1, padding: 20 }}>
      <LinearGradient
        colors={[colors.gradient, colors.highlight]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        style={{
          height: 120,
          width: '100%',
          borderRadius: 10,
        }}>
        {currentBudget && (
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              {/* Display the month */}
              <Text>{`${months[currentBudget.month - 1]} (Current)`}</Text>
              {/* Display the amount left for the month */}
              <Text>
                {Number(
                  currentBudget.budgetTotal -
                    transactions
                      .filter((t: TransactionData) => {
                        const d = new Date(t.date);
                        return isCurrentMonthAndYear(
                          d.getMonth() + 1,
                          d.getFullYear(),
                        );
                      })
                      .reduce(
                        (sum: number, t: TransactionData) => sum + t.total,
                        0,
                      ),
                ).toFixed(2)}
                € <Text>left</Text>
              </Text>
              <Text>Edit</Text>
            </View>
            <View>
              <Text>Meter</Text>
              <SpeedometerChart
                radius={chartRadius}
                used={transactions
                  .filter(t =>
                    isCurrentMonthAndYear(
                      new Date(t.date).getMonth() + 1,
                      new Date(t.date).getFullYear(),
                    ),
                  )
                  .reduce((sum, t) => sum + t.total, 0)}
                total={currentBudget.budgetTotal}
              />
            </View>
          </View>
        )}
      </LinearGradient>
      <Text>Default budget</Text>
      <Button title="add default budget/edit" />
      <Button
        title="Add a budget"
        onPress={() =>
          openModal({
            content: (
              <AddBudgetModal onConfirm={() => closeModal('addBudgetModal')} />
            ),
            id: 'addBudgetModal',
          })
        }
      />
      <Text>Previous Budgets</Text>
      <Button title="LÖl getting shits" onPress={refreshBudgets} />
      <View style={{ marginTop: 20 }}>
        <ScrollView style={{ padding: 10 }}>
          <View>
            {budgets
              .filter(b => !isCurrentMonthAndYear(b.month, b.year))
              .map((budget, i) => (
                <BudgetItem key={i} item={budget} />
              ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default BudgetsPage;
