import { Text, View, TextInput, Button } from 'react-native';
import { BudgetType, BudgetPostType } from '../../../types/budgets';
import { useBudgets } from '../../../context/BudgetContext';
import styles from '../../../styles/styles';
import MonthPicker from 'react-native-month-year-picker';
import { useState } from 'react';

export default function AddBudgetModal({
  onConfirm,
}: {
  onConfirm: () => void;
}) {
  const { createBudget } = useBudgets();
  const [dateOpen, setDateOpen] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date());

  const handleChange = (event: any, newDate?: Date) => {
    setDateOpen(false);

    if (newDate) {
      setDate(newDate);
    }
  };

  return (
    <View>
      <Text>Add a budget</Text>
      <Text>Total</Text>
      <TextInput style={styles.textField} />
      <Text>Date</Text>
      <Text>
        Selected: {date.toLocaleString('default', { month: 'long' })}{' '}
        {date.getFullYear()}
      </Text>
      <Button title="Change date" onPress={() => setDateOpen(true)} />
      <Text>Budget items</Text>
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
