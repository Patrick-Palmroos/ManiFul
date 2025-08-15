import { Text, View, TextInput, Button, TouchableOpacity } from 'react-native';
import { BudgetPostType, BudgetItemType } from '../../../types/budgets';
import { useBudgets } from '../../../context/BudgetContext';
import { useTypes } from '../../../context/TypesContext';
import MonthPicker from 'react-native-month-year-picker';
import { useState, useEffect } from 'react';
import AllocationsModal from '../AllocationsModal';
import { useModalContext } from '../../../context/ModalContext';
import { showMessage } from 'react-native-flash-message';
import text from '../../../styles/text';
import { Shadow } from 'react-native-shadow-2';
import GradientButton from '../../../components/GradientButton/GradientButton';
import styles from './styles';

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
  const { createBudget, budgets } = useBudgets();
  const { categories: typeCategories } = useTypes();
  const categories = typeCategories.filter(c => c.expense);
  const { openModal, closeModal } = useModalContext();
  const [dateOpen, setDateOpen] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date());
  const [total, setTotal] = useState<number>(2000);
  const [prevTotal, setPrevTotal] = useState<number>(2000);
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
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      repeating: false,
    } as BudgetPostType;

    //If budget for said month and year already exists show error
    if (budgets.some(b => b.month === data.month && b.year === data.year)) {
      showMessage({
        message: 'Budget already exists',
        description: `A budget for ${date.toLocaleString('default', {
          month: 'long',
        })} ${date.getFullYear()} already exists.`,
        duration: 5000,
        floating: true,
        type: 'warning',
      });
      setLoading(false);
      return;
    }

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
    <View style={styles.wrapper}>
      {/* Total section */}
      <View style={styles.totalWrapper}>
        <Text style={styles.subTitleText}>Total:</Text>
        <TextInput
          value={tempInputValues}
          inputMode="numeric"
          keyboardType="decimal-pad"
          style={styles.totalInput}
          onBlur={handleTotalChange}
          onChangeText={text => {
            setTempInputValues(text);
          }}
        />
        <Text style={styles.totalEuroSign}>€</Text>
      </View>
      {/* Date section */}
      <View style={styles.dateWrapper}>
        <View style={styles.dateTextWrapper}>
          <Text style={styles.subTitleText}>Date: </Text>
          <Text style={text.regular}>
            {date.toLocaleString('default', { month: 'long' })}{' '}
            {date.getFullYear()}
          </Text>
        </View>
        {/* Change date button */}
        <Shadow
          distance={5}
          startColor="rgba(0, 4, 29, 0.03)"
          offset={[0, 2]}
          stretch={true}>
          <TouchableOpacity
            style={styles.changeDateButton}
            onPress={() => setDateOpen(true)}>
            <Text style={styles.buttonText}>Change date</Text>
          </TouchableOpacity>
        </Shadow>
      </View>
      {/* Budget allocations section */}
      <View style={styles.allocationsWrapper}>
        <Text style={styles.allocationTitle}>Budget Allocation</Text>
        <View style={styles.allocationValuesWrapper}>
          <Text style={styles.allocationsGeneralText}>
            {`Allocated amount\n`}
            <Text style={styles.allocatedText}>
              {chosenCategories.reduce((sum, c) => sum + c.total, 0).toFixed(2)}
              €
            </Text>
          </Text>
          <Text style={styles.allocationsGeneralText}>
            {`Unallocated amount\n`}
            <Text style={styles.unallocatedText}>
              {(
                total - chosenCategories.reduce((sum, c) => sum + c.total, 0)
              ).toFixed(2)}
              €
            </Text>
          </Text>
        </View>
        {/* Edit allocations button */}
        <Shadow
          distance={5}
          startColor="rgba(0, 4, 29, 0.03)"
          offset={[0, 2]}
          stretch={true}>
          <TouchableOpacity
            style={styles.editAllocationsButton}
            onPress={() =>
              openModal({
                content: (
                  <AllocationsModal
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
            }>
            <Text style={styles.buttonText}>Edit allocations</Text>
          </TouchableOpacity>
        </Shadow>
      </View>
      {/* Save button */}
      <View style={styles.saveButtonWrapper}>
        <GradientButton text="Save budget" onClick={onSave} width={'95%'} />
      </View>
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
