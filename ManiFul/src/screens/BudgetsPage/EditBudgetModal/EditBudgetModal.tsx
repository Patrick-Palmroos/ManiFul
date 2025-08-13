import { Text, View, TextInput, Button } from 'react-native';
import {
  BudgetType,
  BudgetPostType,
  BudgetItemType,
  RepeatingBudget,
  AnyBudget,
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
import { isCurrentMonthAndYear } from '../../../utils/date_handling';

type ChosenCategoryValues = {
  categoryId: number;
  categoryName: string;
  total: number;
};

function isRepeatingBudget(budget: AnyBudget): budget is RepeatingBudget {
  return budget.repeating === true;
}

export default function EditBudgetModal({
  onConfirm,
  item,
}: {
  onConfirm: () => void;
  item: AnyBudget;
}) {
  const { updateBudget } = useBudgets();
  const { categories } = useTypes();
  const { openModal, closeModal } = useModalContext();
  const [dateOpen, setDateOpen] = useState<boolean>(false);
  const [date, setDate] = useState<Date | null>(
    isRepeatingBudget(item) ? null : new Date(item.year, item.month - 1),
  );
  const [total, setTotal] = useState<number>(item.budgetTotal);
  const [prevTotal, setPrevTotal] = useState<number>(item.budgetTotal);
  const [loading, setLoading] = useState<boolean>(false);
  const [tempInputValues, setTempInputValues] = useState<string>(
    total.toFixed(2),
  );
  const [chosenCategories, setChosenCategories] = useState<
    ChosenCategoryValues[]
  >(
    item.items.map(i => ({
      categoryId: i.categoryId ? i.categoryId : 1,
      categoryName: i.categoryId
        ? categories.find(c => c.id === i.categoryId)?.name || 'Error'
        : 'None found',
      total: i.amount,
    })),
  );

  //Setting the totals based off percentages.
  useEffect(() => {
    if (total === prevTotal) return;

    // Calculate the proportional distribution based on current amounts
    const newCategoryTotals = chosenCategories.map(cat => ({
      ...cat,
      total: Number(((cat.total / prevTotal) * total).toFixed(2)),
    }));

    // Fix any rounding errors (e.g., if sum != total due to .toFixed(2))
    const adjustedSum = newCategoryTotals.reduce(
      (sum, cat) => sum + cat.total,
      0,
    );
    let roundingDifference = Number((total - adjustedSum).toFixed(2));

    // Distribute the rounding difference (if any) starting from the first category
    const nonZeroCategories = chosenCategories.filter(cat => cat.total > 0);
    const unaccounted =
      prevTotal - chosenCategories.reduce((sum, c) => sum + c.total, 0);

    if (nonZeroCategories.length > 0 && unaccounted <= 0) {
      for (
        let i = 0;
        Math.abs(roundingDifference) >= 0.01 && i < newCategoryTotals.length;
        i++
      ) {
        const adjustment = roundingDifference > 0 ? 0.01 : -0.01;
        if (newCategoryTotals[i].total <= 0) continue;
        newCategoryTotals[i].total = Number(
          (newCategoryTotals[i].total + adjustment).toFixed(2),
        );
        roundingDifference = Number(
          (roundingDifference - adjustment).toFixed(2),
        );
      }
    }

    setChosenCategories(newCategoryTotals);
  }, [total]);

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
      setPrevTotal(total);
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
      month: date ? date.getMonth() + 1 : null,
      year: date ? date.getFullYear() : null,
      repeating: isRepeatingBudget(item),
    } as BudgetPostType;

    const res = updateBudget(data, item.id);

    if (!res) {
      showMessage({
        message: 'Error editing budget',
        description: `Couldn't edit budget due to an error`,
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
      <Text>Edit a budget</Text>
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
      {date && isCurrentMonthAndYear(date.getMonth(), date.getFullYear()) && (
        <View>
          <Text>
            Selected: {date.toLocaleString('default', { month: 'long' })}{' '}
            {date.getFullYear()}
          </Text>
          <Button title="Change date" onPress={() => setDateOpen(true)} />
        </View>
      )}
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
      {dateOpen && date && (
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
