import {
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { Category } from '../../../types/categories';
import { useState, useEffect } from 'react';
import { useTypes } from '../../../context/TypesContext';
import Slider from '@react-native-community/slider';
import styles from '../../../styles/styles';
import Toggle from '../../../components/Toggle';
import text from '../../../styles/text';

type ChosenCategoryValues = {
  categoryId: number;
  categoryName: string;
  total: number;
  locked: boolean;
};

type PropCategoryValues = {
  categoryId: number;
  categoryName: string;
  total: number;
};

const roundTwo = (n: number) => Math.round(n * 100) / 100;

export default function AllocationsModal({
  values,
  totalSum,
  onConfirm,
}: {
  values: PropCategoryValues[];
  totalSum: number;
  onConfirm: (arg1: PropCategoryValues[]) => void;
}) {
  const [toggle, setToggle] = useState<boolean>(false);
  const [sliderValues, setSliderValues] = useState<number[]>(
    values.map(v => v.total),
  );
  const [categoryValues, setCategoryValues] = useState<ChosenCategoryValues[]>([
    ...values.map(v => ({
      ...v,
      total: Number(v.total.toFixed(2)),
      locked: false,
    })),
    {
      categoryId: -1,
      categoryName: 'Unaccounted',
      total: Math.max(
        0,
        roundTwo(totalSum - values.reduce((sum, i) => sum + i.total, 0)),
      ),
      locked: false,
    },
  ]);
  const [total] = useState<number>(totalSum);
  const [inputValues, setInputValues] = useState<string[]>(
    values.map(v => v.total.toFixed(2)),
  );
  const [percentageValues, setPercentageValues] = useState<string[]>(
    values.map(v => ((v.total / totalSum) * 100).toFixed(2)),
  );

  useEffect(() => {
    if (toggle) {
      // Update percentage display values when category values change
      setPercentageValues(
        categoryValues.map(v => ((v.total / total) * 100).toFixed(2)),
      );
    } else {
      // Update absolute value display when category values change
      setInputValues(categoryValues.map(v => v.total.toFixed(2)));
    }
  }, [categoryValues, toggle, total]);

  useEffect(() => {
    setSliderValues(
      categoryValues.filter(c => c.categoryId !== -1).map(c => c.total),
    );
  }, [categoryValues]);

  const toggleLock = (index: number) => {
    const updated = [...categoryValues];
    updated[index].locked = !updated[index].locked;
    setCategoryValues(updated);
  };

  const handleValueChange = (index: number, newValue: number) => {
    const roundedNewValue = roundTwo(newValue);

    const currentValues = [...categoryValues];

    const currentVal = currentValues[index].total;
    const delta = newValue - currentVal;
    const updated = [...currentValues];
    const unaccountedIndex = updated.findIndex(c => c.categoryId === -1);

    // Clamp new value between 0 and total
    updated[index].total = Math.max(0, Math.min(roundedNewValue, total));

    // Get all locked categories (excluding the current one and unaccounted)
    const lockedCategories = updated.filter(
      (c, i) => c.locked && i !== index && c.categoryId !== -1,
    );
    const totalLocked = lockedCategories.reduce((sum, c) => sum + c.total, 0);

    const maxAvailable = total - totalLocked;

    // If increasing the value and don't have any in unaccounted
    if (delta > 0) {
      // Check if has have enough available considering locked values
      if (updated[index].total > maxAvailable) {
        updated[index].total = maxAvailable;
      }
      // increasing the value
      if (unaccountedIndex !== -1) {
        const unaccountedVal = updated[unaccountedIndex].total;
        if (unaccountedVal >= delta) {
          // Use unaccounted value fully
          updated[unaccountedIndex].total = roundTwo(unaccountedVal - delta);
        } else {
          // Use all unaccounted and reduce others for remaining amount
          const remainder = delta - unaccountedVal;
          updated[unaccountedIndex].total = 0;

          // Only adjust unlocked categories (excluding current and unaccounted)
          const adjustableCategories = updated.filter(
            (c, i) => !c.locked && i !== index && i !== unaccountedIndex,
          );
          const totalAdjustable = adjustableCategories.reduce(
            (sum, c) => sum + c.total,
            0,
          );

          if (totalAdjustable > 0) {
            adjustableCategories.forEach(cat => {
              const reduction = (cat.total / totalAdjustable) * remainder;
              cat.total = Math.max(0, cat.total - reduction);
            });

            // Update main array
            adjustableCategories.forEach(cat => {
              const originalIndex = updated.findIndex(
                c => c.categoryId === cat.categoryId,
              );
              if (originalIndex !== -1) {
                updated[originalIndex].total = roundTwo(cat.total);
              }
            });
          }
        }
      }
    } else if (delta < 0) {
      // Decreasing the value, move the delta to unaccounted
      if (unaccountedIndex !== -1) {
        updated[unaccountedIndex].total = roundTwo(
          updated[unaccountedIndex].total - delta,
        );
      }
    }

    // Ensure no floating point precision issues come to haunt
    updated.forEach(c => {
      c.total = roundTwo(c.total);
    });

    if (unaccountedIndex !== -1) {
      updated[unaccountedIndex].total = Math.max(
        0,
        updated[unaccountedIndex].total,
      );
    }

    let runningTotal = updated.reduce((sum, c) => sum + c.total, 0);
    let finalDiff = roundTwo(total - runningTotal);

    if (Math.abs(finalDiff) >= 0.01) {
      const adjustableIndex = updated.findIndex(
        (c, idx) => !c.locked && idx !== index && c.categoryId !== -1,
      );

      if (adjustableIndex !== -1) {
        updated[adjustableIndex].total = roundTwo(
          updated[adjustableIndex].total + finalDiff,
        );
      }
    }

    setCategoryValues(updated);
  };

  const handleSliderChange = (index: number, value: number) => {
    handleValueChange(index, value);
  };

  const calculateMaxPossibleValue = (index: number) => {
    const currentValues = [...categoryValues];

    // Current unaccounted amount
    const unaccountedIndex = currentValues.findIndex(c => c.categoryId === -1);
    const unaccountedValue =
      unaccountedIndex !== -1 ? currentValues[unaccountedIndex].total : 0;

    // Current value of this category
    const currentValue = currentValues[index].total;

    return (
      currentValue +
      unaccountedValue +
      currentValues.reduce(
        (sum, c, i) =>
          sum + (!c.locked && i !== index && c.categoryId !== -1 ? c.total : 0),
        0,
      )
    );
  };

  const handleAbsoluteInputBlur = (index: number) => {
    const parsed = Number(inputValues[index].replace(',', '.'));
    if (!isNaN(parsed)) {
      handleValueChange(index, parsed);
    } else {
      // Reset to current value if invalid
      const newInputs = [...inputValues];
      newInputs[index] = categoryValues[index].total.toFixed(2);
      setInputValues(newInputs);
    }
  };

  const handlePercentageInputBlur = (index: number) => {
    const parsed = Number(percentageValues[index].replace(',', '.'));
    if (!isNaN(parsed)) {
      const newValue = (parsed / 100) * total;
      handleValueChange(index, newValue);
    } else {
      // Reset to current percentage if invalid
      const newPercentages = [...percentageValues];
      newPercentages[index] = (
        (categoryValues[index].total / total) *
        100
      ).toFixed(2);
      setPercentageValues(newPercentages);
    }
  };

  const resetAllToZero = () => {
    const totalSum = total;
    const zeroedValues = categoryValues.map(v => {
      if (v.categoryId === -1) {
        return { ...v, total: totalSum, locked: false };
      }
      return { ...v, total: 0, locked: false };
    });

    setCategoryValues(zeroedValues);
    setInputValues(zeroedValues.map(v => v.total.toFixed(2)));
    setPercentageValues(
      zeroedValues.map(v => ((v.total / totalSum) * 100).toFixed(2)),
    );
  };

  const divideEvenly = () => {
    const unlockedCategories = categoryValues.filter(
      c => !c.locked && c.categoryId !== -1,
    );
    const lockedCategories = categoryValues.filter(
      c => c.locked && c.categoryId !== -1,
    );
    const unaccountedIndex = categoryValues.findIndex(c => c.categoryId === -1);

    // How much is available after keeping locked categories
    const availableTotal =
      total - lockedCategories.reduce((sum, c) => sum + c.total, 0);

    if (unlockedCategories.length === 0) return;

    // divide evenly for unlocked categories
    const share = roundTwo(availableTotal / unlockedCategories.length);

    let updated = categoryValues.map(c => {
      if (c.locked || c.categoryId === -1) {
        return { ...c }; // no change for locked and unaccounted
      }
      return { ...c, total: share };
    });

    // Fix any rounding difference by adjusting first unlocked category
    let distributedSum = updated
      .filter(c => c.categoryId !== -1)
      .reduce((sum, c) => sum + c.total, 0);
    let roundingDiff = roundTwo(total - distributedSum);

    if (Math.abs(roundingDiff) >= 0.01) {
      const adjustIndex = updated.findIndex(
        c => !c.locked && c.categoryId !== -1,
      );
      if (adjustIndex !== -1) {
        updated[adjustIndex].total = roundTwo(
          updated[adjustIndex].total + roundingDiff,
        );
      }
    }

    // Update unaccounted
    if (unaccountedIndex !== -1) {
      updated[unaccountedIndex].total = roundTwo(
        total -
          updated
            .filter(c => c.categoryId !== -1)
            .reduce((sum, c) => sum + c.total, 0),
      );
    }

    setCategoryValues(updated);
    setInputValues(updated.map(v => v.total.toFixed(2)));
    setPercentageValues(updated.map(v => ((v.total / total) * 100).toFixed(2)));
  };

  const unlockAll = () => {
    const unlockedValues = categoryValues.map(v => ({
      ...v,
      locked: false,
    }));
    setCategoryValues(unlockedValues);
  };

  return (
    <View style={{ height: '100%' }}>
      <View style={{ alignItems: 'center' }}>
        <Toggle
          value={toggle}
          onValueChange={value => setToggle(value)}
          field1="Numbers"
          field2="Percentages"
          width={'70%'}
        />
      </View>
      <TouchableOpacity
        onPress={resetAllToZero}
        style={{ backgroundColor: 'cyan', padding: 2, borderRadius: 5 }}>
        <Text style={text.regular}>Reset All</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={divideEvenly}
        style={{ backgroundColor: 'cyan', padding: 2, borderRadius: 5 }}>
        <Text style={text.regular}>divide evenly</Text>
      </TouchableOpacity>
      <Text>Add them items</Text>
      <Text>Total: {total.toFixed(2)}</Text>
      <Text>
        Unaccounted: {categoryValues.find(c => c.categoryId === -1)?.total}
      </Text>
      <Text>
        Total calculated:{' '}
        {categoryValues
          .filter(c => c.categoryId !== -1)
          .reduce((sum, c) => sum + c.total, 0)}
      </Text>
      <ScrollView scrollEnabled={true} style={{ marginBottom: 20 }}>
        <TouchableWithoutFeedback>
          <View style={{ flex: 1, marginBottom: 20, marginTop: 20 }}>
            {categoryValues
              .filter(c => c.categoryId !== -1)
              .sort((a, b) => a.categoryId - b.categoryId)
              .map((value, i) => (
                <View key={i} style={{ marginBottom: 16 }}>
                  <Text>
                    {value.categoryName} | {value.total.toFixed(2)} (
                    {((value.total / total) * 100).toFixed(2)}%)
                  </Text>
                  <TouchableOpacity onPress={() => toggleLock(i)}>
                    <Text>{value.locked ? 'locked' : 'unlocked'}</Text>
                  </TouchableOpacity>
                  <Slider
                    minimumValue={0}
                    maximumValue={total}
                    minimumTrackTintColor="#007aff"
                    maximumTrackTintColor="#d3d3d3"
                    upperLimit={calculateMaxPossibleValue(i)}
                    step={10}
                    value={sliderValues[i]}
                    onValueChange={val => handleSliderChange(i, val)}
                    disabled={value.locked}
                  />
                  {toggle ? (
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <TextInput
                        value={percentageValues[i]}
                        inputMode="numeric"
                        keyboardType="decimal-pad"
                        style={styles.textField}
                        onChangeText={text => {
                          const newPercentages = [...percentageValues];
                          newPercentages[i] = text;
                          setPercentageValues(newPercentages);
                        }}
                        onBlur={() => handlePercentageInputBlur(i)}
                      />
                      <Text>%</Text>
                    </View>
                  ) : (
                    <TextInput
                      value={inputValues[i]}
                      inputMode="numeric"
                      keyboardType="decimal-pad"
                      style={styles.textField}
                      onChangeText={text => {
                        const newInputs = [...inputValues];
                        newInputs[i] = text;
                        setInputValues(newInputs);
                      }}
                      onBlur={() => handleAbsoluteInputBlur(i)}
                    />
                  )}
                </View>
              ))}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      <Button
        title="save"
        onPress={() =>
          onConfirm(categoryValues.filter(c => c.categoryId !== -1))
        }
      />
    </View>
  );
}
