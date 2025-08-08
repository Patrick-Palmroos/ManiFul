import {
  View,
  Text,
  Button,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
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
import EditBudgetModal from './EditBudgetModal';
import { useTypes } from '../../context/TypesContext';

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
  const { budgets, refreshBudgets, defaultBudget, currentBudget } =
    useBudgets();
  const { categories } = useTypes();
  const { transactions } = useTransactions();
  const { openModal, closeModal } = useModalContext();

  const screenWidth = Dimensions.get('window').width;
  const chartRadius = screenWidth * 0.18;

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
      {/* Top card */}
      <LinearGradient
        colors={[colors.highlight, '#861955']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0.6, y: 0 }}
        style={{
          height: 120,
          width: '100%',
          borderRadius: 10,
        }}>
        {/* Conditional render */}
        {currentBudget && (
          /* Wrapper for the whole section */
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              height: '100%',
            }}>
            {/* Display the month */}
            <View style={{ justifyContent: 'space-evenly', marginLeft: 10 }}>
              <Text
                style={{
                  ...text.regularSemiBold,
                  color: colors.light,
                  fontSize: 20,
                }}>
                {`${months[currentBudget.month - 1]}`}
                <Text style={{ fontSize: 14 }}>
                  {'  '}
                  (Current)
                </Text>
              </Text>
              {/* Display the amount left for the month */}
              <Text
                style={{
                  ...text.moneyLight,
                  fontSize: 24,
                  lineHeight: 24,
                }}>
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
                €{' '}
                <Text
                  style={{
                    ...text.regularLight,
                    color: colors.light,
                    fontSize: 18,
                  }}>
                  left
                </Text>
              </Text>
              {/* Edit button */}
              <TouchableOpacity
                onPress={() =>
                  openModal({
                    content: (
                      <EditBudgetModal
                        item={currentBudget}
                        onConfirm={() => closeModal('EditBudgetModal')}
                      />
                    ),
                    id: 'EditBudgetModal',
                  })
                }
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.light,
                  width: 110,
                  height: 30,
                  borderRadius: 8,
                }}>
                <Text style={{ ...text.regularMedium, color: '#861955' }}>
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
            {/* Speedometer chart wrapper */}
            <View
              style={{
                position: 'relative',
                right: 10,
                justifyContent: 'center',
              }}>
              {/* speedometer chart */}
              <SpeedometerChart
                fillColor={colors.light}
                backgroundColor={colors.highlight}
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
      {defaultBudget && (
        <View
          style={{
            backgroundColor: colors.light,
            //height: 100,
            width: '100%',
            marginTop: 5,
            marginBottom: 20,
            borderRadius: 8,
            padding: 8,
          }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ ...text.title, fontSize: 18 }}>Default budget</Text>
            <Text style={{ ...text.regularSemiBold }}>
              Total:{' '}
              <Text style={text.moneyDark}>{defaultBudget.budgetTotal}€</Text>
            </Text>
          </View>
          <View
            style={{
              marginTop: 5,
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 4,
            }}>
            {defaultBudget.items.map((item, i) => (
              <View key={i} style={{ width: 100, alignItems: 'center' }}>
                <Text style={{ textAlign: 'center' }}>
                  {categories.find(c => c.id === item.categoryId)?.name}
                </Text>
                <Text>
                  Pec: {(item.amount / defaultBudget.budgetTotal) * 100}
                </Text>
                <Text style={{ textAlign: 'center' }}>{item.amount}€</Text>
              </View>
            ))}
          </View>
        </View>
      )}
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
