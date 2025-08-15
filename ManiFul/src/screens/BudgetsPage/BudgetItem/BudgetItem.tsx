import { Text, TouchableOpacity, View, Button } from 'react-native';
import { BudgetType } from '../../../types/budgets';
import { useTransactions } from '../../../context/TransactionContext';
import { useEffect, useState } from 'react';
import { TransactionData } from '../../../types/data';
import { Shadow } from 'react-native-shadow-2';
import { useBudgets } from '../../../context/BudgetContext';
import { useModalContext } from '../../../context/ModalContext';
import EditBudgetModal from '../EditBudgetModal';
import text from '../../../styles/text';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import colors from '../../../styles/colors';
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

const BudgetItem = ({ item }: { item: BudgetType }) => {
  const { transactions } = useTransactions();
  const { deleteBudget } = useBudgets();
  const { openModal, closeModal } = useModalContext();
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
      <View style={styles.wrapper}>
        <View>
          {/* Date */}
          <Text style={text.title}>
            {item.year} {months[item.month - 1]}
          </Text>
          {/* Months expenses */}
          <Text style={text.regular}>
            {monthsTransactions
              ? monthsTransactions.reduce((sum, item) => sum + item.total, 0)
              : '0'}
            /{item.budgetTotal} €
          </Text>
        </View>
        {/* Delete and edit budget */}
        <View style={styles.deleteAndEditWrapper}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteBudget(item.id)}>
            <MaterialIcons name={'delete'} size={20} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              openModal({
                content: (
                  <EditBudgetModal
                    onConfirm={() => closeModal('editBudgetModal')}
                    item={item}
                  />
                ),
                title: 'Edit budget',
                id: 'editBudgetModal',
              })
            }>
            <MaterialIcons name={'edit'} size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </Shadow>
  );
};

export default BudgetItem;
