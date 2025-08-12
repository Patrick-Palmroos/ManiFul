import { Text, View, TextInput, Button } from 'react-native';
import {
  BudgetType,
  BudgetPostType,
  BudgetItemType,
} from '../../../types/budgets';
import { useBudgets } from '../../../context/BudgetContext';
import { useTypes } from '../../../context/TypesContext';
import styles from '../../../styles/styles';
import MonthPicker from 'react-native-month-year-picker';
import { useState, useEffect } from 'react';
import AddBudgetItemModal from '../AddBudgetItemModal';
import { useModalContext } from '../../../context/ModalContext';
import { Category } from '../../../types/categories';
import { showMessage } from 'react-native-flash-message';

type ChosenCategoryValues = {
  categoryId: number;
  categoryName: string;
  total: number;
};

export default function AddBudgetModal({
  onConfirm,
}: {
  onConfirm: () => void;
}) {
  const { createBudget } = useBudgets();
  const { categories: typeCategories } = useTypes();
  const categories = typeCategories.filter(c => c.expense);
  const { openModal, closeModal } = useModalContext();
  const [dateOpen, setDateOpen] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date());
  const [total, setTotal] = useState<number>(2000);
  const [loading, setLoading] = useState<boolean>(false);
  const [tempInputValues, setTempInputValues] = useState<string>(
    total.toFixed(2),
  );
  const [chosenCategories, setChosenCategories] = useState<
    ChosenCategoryValues[]
  >(
    categories.map(c => ({
      categoryId: c.id,
      categoryName: c.name,
      total: total / categories.length,
    })),
  );

  //Setting the totals based off percentages.
  useEffect(() => {
    const currentSum = chosenCategories.reduce(
      (sum, cat) => sum + cat.total,
      0,
    );

    if (currentSum === 0) return;

    // Calculate the distribution based on current amounts
    const newCategoryTotals = chosenCategories.map(cat => ({
      ...cat,
      total: Number(((cat.total / currentSum) * total).toFixed(2)),
    }));

    // Fix rounding errors
    const adjustedSum = newCategoryTotals.reduce(
      (sum, cat) => sum + cat.total,
      0,
    );
    let roundingDifference = Number((total - adjustedSum).toFixed(2));

    // Distribute the rounding difference
    for (
      let i = 0;
      Math.abs(roundingDifference) >= 0.01 && i < newCategoryTotals.length;
      i++
    ) {
      const adjustment = roundingDifference > 0 ? 0.01 : -0.01;
      newCategoryTotals[i].total = Number(
        (newCategoryTotals[i].total + adjustment).toFixed(2),
      );
      roundingDifference = Number((roundingDifference - adjustment).toFixed(2));
    }

    setChosenCategories(newCategoryTotals);
  }, [total, categories.length]);

  const handleChange = (event: any, newDate?: Date) => {
    setDateOpen(false);

    if (newDate) {
      setDate(newDate);
    }
  };

  const onConfirmItems = (items: ChosenCategoryValues[]) => {
    setChosenCategories(items);
    closeModal('BudgetItemModal');
  };

  const handleTotalChange = () => {
    const parsed = Number(tempInputValues?.replace(',', '.'));

    if (!isNaN(parsed)) {
      if (parsed < 0) {
        setTempInputValues(total.toFixed(2));
        return;
      }
      const fixed = parsed.toFixed(2);
      setTotal(Number(fixed));
      setTempInputValues(fixed);
    } else {
      setTempInputValues(total.toFixed(2));
    }
  };

  const onSave = async () => {
    setLoading(true);
    const data = {
      active: true,
      budgetTotal: total,
      items: chosenCategories.map(
        c =>
          ({
            categoryId: c.categoryId,
            typeId: null,
            amount: c.total,
          } as BudgetItemType),
      ),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      repeating: false,
    } as BudgetPostType;

    const res = createBudget(data);

    if (!res) {
      showMessage({
        message: 'Error adding budget',
        description: `Couldn't add budget due to an error`,
        duration: 5000,
        floating: true,
        type: 'danger',
      });
      setLoading(false);

      return;
    }
    showMessage({
      message: 'Succesfully added budget!',
      description: `Your budget was succesfully saved`,
      duration: 5000,
      floating: true,
      type: 'success',
    });
    setLoading(false);
    onConfirm();
    return;
  };

  return (
    <View>
      <Text>Add a budget</Text>
      <Text>Total</Text>
      <TextInput
        value={tempInputValues}
        inputMode="numeric"
        keyboardType="decimal-pad"
        style={styles.textField}
        onBlur={handleTotalChange}
        onChangeText={text => {
          setTempInputValues(text);
        }}
      />
      <Text>
        Chosen totals:{' '}
        {chosenCategories.reduce((sum, c) => sum + c.total, 0).toFixed(2)}
      </Text>
      <Text>Date</Text>
      <Text>
        Selected: {date.toLocaleString('default', { month: 'long' })}{' '}
        {date.getFullYear()}
      </Text>
      <Button title="Change date" onPress={() => setDateOpen(true)} />
      <Text>Budget items</Text>
      <Button
        title="Select budget item"
        onPress={() =>
          openModal({
            content: (
              <AddBudgetItemModal
                values={chosenCategories}
                totalSum={total}
                onConfirm={v => {
                  setChosenCategories(v);
                  closeModal('BudgetItemModal');
                }}
              />
            ),
            id: 'BudgetItemModal',
          })
        }
      />
      <Button title="Save" onPress={onSave} />
      {dateOpen && (
        <MonthPicker
          value={date}
          onChange={handleChange}
          locale="en" // change to fi for finnish
          minimumDate={new Date()}
        />
      )}
    </View>
  );
}
