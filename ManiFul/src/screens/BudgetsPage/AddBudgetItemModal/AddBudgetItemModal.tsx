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
  const [categoryValues, setCategoryValues] = useState<ChosenCategoryValues[]>(
    values.map(v => ({ ...v, total: Number(v.total.toFixed(2)) })),
  );
  const [total] = useState<number>(totalSum);
  const [unaccounted, setUnaccounted] = useState<number>(
    totalSum - values.reduce((sum, c) => sum + c.total, 0),
  );
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
    const roundedNewValue = Math.round(newValue * 100) / 100;

    const currentValues = [...categoryValues];
    const totalSoFar = currentValues.reduce(
      (sum, c) => sum + Math.round(c.total * 100) / 100,
      0,
    );
    const currentUnaccounted = total - totalSoFar;

    const currentVal = currentValues[index].total;
    const delta = newValue - currentVal;
    const updated = [...currentValues];

    // Clamp new value between 0 and total
    const clampedNewValue = Math.max(0, Math.min(newValue, total));
    updated[index].total = clampedNewValue;

    let newUnaccounted = currentUnaccounted - delta;

    // If we're increasing the value and don't have any in unaccounted
    if (delta > 0 && newUnaccounted < 0) {
      const deficit = -newUnaccounted;
      const otherCategories = updated.filter((_, i) => i !== index);
      const totalOther = otherCategories.reduce((sum, c) => sum + c.total, 0);

      if (totalOther > 0) {
        // Reduce other categories proportionally
        otherCategories.forEach(cat => {
          const reduction = (cat.total / totalOther) * deficit;
          cat.total -= reduction;
        });

        // Update the main array with reduced values
        otherCategories.forEach((cat, i) => {
          const originalIndex = updated.findIndex(
            c => c.categoryId === cat.categoryId,
          );
          if (originalIndex !== -1) {
            updated[originalIndex].total = Math.max(0, cat.total);
          }
        });
      }

      // Recalculate unaccounted after redistribution
      newUnaccounted = total - updated.reduce((sum, c) => sum + c.total, 0);
    }

    // Ensure no floating point precision issues come to haunt
    updated.forEach(c => {
      c.total = Math.round(c.total * 100) / 100;
    });
    newUnaccounted = parseFloat(newUnaccounted.toFixed(2));

    const calculatedTotal = updated.reduce((sum, c) => sum + c.total, 0);
    const roundedTotal = Math.round(calculatedTotal * 100) / 100;

    if (Math.abs(roundedTotal - total) > 0.001 && updated.length > 0) {
      const diff = total - roundedTotal;
      updated[updated.length - 1].total += diff;
      updated[updated.length - 1].total =
        Math.round(updated[updated.length - 1].total * 100) / 100;
    }

    setUnaccounted(total - updated.reduce((sum, c) => sum + c.total, 0));
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
    setUnaccounted(totalSum);
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
      <Text>Unaccounted: {unaccounted.toFixed(2)}</Text>
      <Text>
        Total calculated: {categoryValues.reduce((sum, c) => sum + c.total, 0)}
      </Text>
      <ScrollView scrollEnabled={true} style={{ marginBottom: 20 }}>
        <TouchableWithoutFeedback>
          <View style={{ flex: 1, marginBottom: 20, marginTop: 20 }}>
            {categoryValues.map((value, i) => (
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
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
      <Button title="save" onPress={() => onConfirm(categoryValues)} />
    </View>
  );
}
