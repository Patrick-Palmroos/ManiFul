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
import MaterialIcons from '@react-native-vector-icons/material-icons';
import GradientButton from '../../components/GradientButton/GradientButton';
import styles from './styles';

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

  if (!budgets) {
    return (
      <View style={styles.loadingWrapper}>
        <ActivityIndicator size={50} color={colors.highlight} />
        <Text style={text.subtext}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.wrapper}>
      {/* Top card */}
      <LinearGradient
        colors={[colors.highlight, '#861955']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0.6, y: 0 }}
        style={styles.topCardGradient}>
        {/* Conditional render */}
        {currentBudget && (
          /* Wrapper for the whole section */
          <View style={styles.topCardWrapper}>
            {/* Display the month */}
            <View style={styles.monthWrapper}>
              <Text style={styles.dateText}>
                {`${months[currentBudget.month - 1]}`}
                <Text style={{ fontSize: 14 }}>
                  {'  '}
                  (Current)
                </Text>
              </Text>
              {/* Display the amount left for the month */}
              <Text style={styles.amountText}>
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
                € <Text style={styles.amountLeftText}>left</Text>
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
                    title: 'Edit current budget',
                    id: 'EditBudgetModal',
                  })
                }
                style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit</Text>
                <MaterialIcons
                  name={'edit'}
                  size={20}
                  color={'#861955'}
                  style={{ marginLeft: 5, marginBottom: 3 }}
                />
              </TouchableOpacity>
            </View>
            {/* Speedometer chart wrapper */}
            <View style={styles.speedometerWrapper}>
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
      {/* Default budget */}
      {defaultBudget && (
        <View style={styles.defaultBudgetWrapper}>
          {/* View for title and total */}
          <View style={styles.defaultBudgetTitleAndTotalWrapper}>
            {/* Pressable title */}
            <TouchableOpacity
              onPress={() =>
                openModal({
                  content: (
                    <EditBudgetModal
                      item={defaultBudget}
                      onConfirm={() => closeModal('EditBudgetModal')}
                    />
                  ),
                  title: 'Edit default budget',
                  id: 'EditBudgetModal',
                })
              }>
              <View style={styles.defaultBudgetTitleAndTotal}>
                <Text style={styles.defaultBudggetTitle}>Default budget</Text>
                <MaterialIcons
                  name={'edit'}
                  size={20}
                  color={colors.textDefault}
                  style={styles.defaultBudgetTitleIcon}
                />
              </View>
            </TouchableOpacity>
            {/* Total */}
            <Text style={text.regularSemiBold}>
              Total:{' '}
              <Text style={text.moneyDark}>{defaultBudget.budgetTotal}€</Text>
            </Text>
          </View>
          {/* Default budget allocations */}
          <View style={styles.defaultBudgetAllocationsWrapper}>
            {defaultBudget.items.map((item, i) => (
              <View key={i} style={{ width: 100, alignItems: 'center' }}>
                <Text style={styles.defaultBudgetCategoryName}>
                  {categories.find(c => c.id === item.categoryId)?.name}
                </Text>

                <View style={styles.defaultAllocationTotalAndPercentage}>
                  <Text style={styles.defaultAllocationTotal}>
                    {item.amount}€
                  </Text>
                  <Text style={styles.defaultAllocationPercentage}>
                    ({(item.amount / defaultBudget.budgetTotal) * 100}%)
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
      <View style={styles.addBudgetWrapper}>
        <GradientButton
          text="Add a budget"
          width={'90%'}
          onClick={() =>
            openModal({
              content: (
                <AddBudgetModal
                  onConfirm={() => closeModal('addBudgetModal')}
                />
              ),
              title: 'Add a budget',
              id: 'addBudgetModal',
            })
          }
        />
      </View>
      <Text style={text.regularSemiBold}>Previous Budgets</Text>
      <View style={{ marginBottom: 200 }}>
        <View>
          {budgets
            .filter(b => !isCurrentMonthAndYear(b.month, b.year))
            .map((budget, i) => (
              <BudgetItem key={i} item={budget} />
            ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default BudgetsPage;
