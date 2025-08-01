import { View, Text, Button, TextInput } from 'react-native';
import { Category } from '../../../types/categories';
import { useState, useEffect } from 'react';
import { useTypes } from '../../../context/TypesContext';
import Slider from '@react-native-community/slider';
import styles from '../../../styles/styles';

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

  useEffect(() => {
    setInputValues(categoryValues.map(v => v.total.toFixed(2)));
  }, [categoryValues]);

  const handleValueChange = (index: number, newValue: number) => {
    const currentValues = [...categoryValues];
    const totalSoFar = currentValues.reduce((sum, c) => sum + c.total, 0);
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
    updated.forEach(c => (c.total = parseFloat(c.total.toFixed(2))));
    newUnaccounted = parseFloat(newUnaccounted.toFixed(2));

    setUnaccounted(newUnaccounted);
    setCategoryValues(updated);
  };

  const handleSliderChange = (index: number, value: number) => {
    handleValueChange(index, value);
  };

  const handleInputBlur = (index: number) => {
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

  return (
    <View>
      <Text>Add them items</Text>
      <Text>Total: {total.toFixed(2)}</Text>
      <Text>Unaccounted: {unaccounted.toFixed(2)}</Text>
      {categoryValues.map((value, i) => (
        <View key={i} style={{ marginBottom: 16 }}>
          <Text>
            {value.categoryName} | {value.total.toFixed(2)}
          </Text>
          <Slider
            minimumValue={0}
            maximumValue={total}
            minimumTrackTintColor="#007aff"
            maximumTrackTintColor="#d3d3d3"
            step={1}
            value={value.total}
            onValueChange={val => handleSliderChange(i, val)}
          />
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
            onBlur={() => handleInputBlur(i)}
          />
        </View>
      ))}
      <Button title="save" onPress={() => onConfirm(categoryValues)} />
    </View>
  );
}
