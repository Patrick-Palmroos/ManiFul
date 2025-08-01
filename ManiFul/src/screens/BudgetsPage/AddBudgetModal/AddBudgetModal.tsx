import { Text, View, TextInput, Button } from 'react-native';
import { BudgetType, BudgetPostType } from '../../../types/budgets';
import { useBudgets } from '../../../context/BudgetContext';
import { useTypes } from '../../../context/TypesContext';
import styles from '../../../styles/styles';
import MonthPicker from 'react-native-month-year-picker';
import { useState } from 'react';
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
    total.toString(),
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
