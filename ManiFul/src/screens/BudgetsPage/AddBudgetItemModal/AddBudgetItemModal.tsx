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
};

const roundTwo = (n: number) => Math.round(n * 100) / 100;

export default function AddBudgetItemModal({
  values,
  totalSum,
  onConfirm,
}: {
  values: ChosenCategoryValues[];
  totalSum: number;
  onConfirm: (arg1: ChosenCategoryValues[]) => void;
}) {
  const [toggle, setToggle] = useState<boolean>(false);
  const [categoryValues, setCategoryValues] = useState<ChosenCategoryValues[]>([
    ...values.map(v => ({ ...v, total: Number(v.total.toFixed(2)) })),
    {
      categoryId: -1,
      categoryName: 'Unaccounted',
      total:
        Number(values.reduce((sum, i) => sum + i.total, 0).toFixed(2)) -
        totalSum,
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

  const handleValueChange = (index: number, newValue: number) => {
    const roundedNewValue = roundTwo(newValue);

    const currentValues = [...categoryValues];
    const totalSoFar = currentValues.reduce(
      (sum, c) => sum + Math.round(c.total * 100) / 100,
      0,
    );
    const currentUnaccounted = total - totalSoFar;

    const currentVal = currentValues[index].total;
    const delta = newValue - currentVal;
    const updated = [...currentValues];
    const unaccountedIndex = updated.findIndex(c => c.categoryId === -1);

    // Clamp new value between 0 and total
    updated[index].total = Math.max(0, Math.min(roundedNewValue, total));

    // If increasing the value and don't have any in unaccounted
    if (delta > 0) {
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

          const otherCategories = updated.filter(
            (_, i) => i !== index && i !== unaccountedIndex,
          );
          const totalOther = otherCategories.reduce(
            (sum, c) => sum + c.total,
            0,
          );

          if (totalOther > 0) {
            otherCategories.forEach(cat => {
              const reduction = (cat.total / totalOther) * remainder;
              cat.total = Math.max(0, cat.total - reduction);
            });

            // Update main array
            otherCategories.forEach(cat => {
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
      const adjustableIndex = updated
        .map((c, idx) => ({ ...c, idx }))
        .filter(c => c.categoryId !== -1) // exclude "Unaccounted"
        .sort((a, b) => b.total - a.total)[0]?.idx;

      if (adjustableIndex !== undefined) {
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
    const zeroedValues = categoryValues.map(v => ({
      ...v,
      total: 0,
    }));

    setCategoryValues(zeroedValues);
    setInputValues(zeroedValues.map(v => v.total.toFixed(2)));
    setPercentageValues(zeroedValues.map(v => '0.00'));
  };

  return (
    <View style={{ height: '100%' }}>
      <Toggle
        value={toggle}
        onValueChange={value => setToggle(value)}
        field1="Numbers"
        field2="Percentages"
        width={'70%'}
      />
      <TouchableOpacity
        onPress={resetAllToZero}
        style={{ backgroundColor: 'cyan', padding: 2, borderRadius: 5 }}>
        <Text style={text.regular}>Reset All</Text>
      </TouchableOpacity>
      <Text>Add them items</Text>
      <Text>Total: {total.toFixed(2)}</Text>
      <Text>
        Unaccounted: {categoryValues.find(c => c.categoryId === -1)?.total}
      </Text>
      <Text>
        Total calculated: {categoryValues.reduce((sum, c) => sum + c.total, 0)}
      </Text>
      <ScrollView scrollEnabled={true} style={{ marginBottom: 20 }}>
        <TouchableWithoutFeedback>
          <View style={{ flex: 1, marginBottom: 20, marginTop: 20 }}>
            {categoryValues
              .filter(c => c.categoryId !== -1)
              .map((value, i) => (
                <View key={i} style={{ marginBottom: 16 }}>
                  <Text>
                    {value.categoryName} | {value.total.toFixed(2)} (
                    {((value.total / total) * 100).toFixed(2)}%)
                  </Text>

                  <Slider
                    minimumValue={0}
                    maximumValue={total}
                    minimumTrackTintColor="#007aff"
                    maximumTrackTintColor="#d3d3d3"
                    step={10}
                    value={value.total}
                    onValueChange={val => handleSliderChange(i, val)}
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
