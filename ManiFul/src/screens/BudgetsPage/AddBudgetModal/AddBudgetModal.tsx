import { Text, View, TextInput, Button } from 'react-native';
import { BudgetType, BudgetPostType } from '../../../types/budgets';
import { useBudgets } from '../../../context/BudgetContext';
import { useTypes } from '../../../context/TypesContext';
import styles from '../../../styles/styles';
import MonthPicker from 'react-native-month-year-picker';
import { useState, useEffect } from 'react';
import AddBudgetItemModal from '../AddBudgetItemModal';
import { useModalContext } from '../../../context/ModalContext';
import { Category } from '../../../types/categories';

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
  const { categories } = useTypes();
  const { openModal, closeModal } = useModalContext();
  const [dateOpen, setDateOpen] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date());
  const [total, setTotal] = useState<number>(2000);
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
    const categoryCount = chosenCategories.length;
    if (categoryCount === 0) return;

    const baseAmount = Number((total / categoryCount).toFixed(2));
    const distributedTotal = baseAmount * categoryCount;
    const remaining = Number((total - distributedTotal).toFixed(2));

    const newCategories = chosenCategories.map(c => ({
      ...c,
      total: baseAmount,
    }));

    if (Math.abs(remaining) >= 0.01) {
      // Find how many categories need adjustment
      const adjustCount = Math.round(Math.abs(remaining) / 0.01);
      const adjustAmount = Number((remaining / adjustCount).toFixed(2));

      // Apply the adjustment to the first few categories
      for (let i = 0; i < adjustCount; i++) {
        newCategories[i].total = Number(
          (newCategories[i].total + adjustAmount).toFixed(2),
        );
      }
    }

    setChosenCategories(newCategories);
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
      const fixed = parsed.toFixed(2);
      setTotal(Number(fixed));
      setTempInputValues(fixed);
    } else {
      setTempInputValues(total.toFixed(2));
    }
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
