import { View, Text, Button } from 'react-native';
import { Category } from '../../../types/categories';
import { useState } from 'react';
import { useTypes } from '../../../context/TypesContext';

type ChosenCategoryValues = {
  categoryId: number;
  categoryName: string;
  total: number;
};

export default function AddBudgetItemModal({
  values,
  onConfirm,
}: {
  values: ChosenCategoryValues[];
  onConfirm: (arg1: ChosenCategoryValues[]) => void;
}) {
  const [categoryValues, setCategoryValues] =
    useState<ChosenCategoryValues[]>(values);

  return (
    <View>
      <Text>Add them items</Text>
      {categoryValues.map((value, i) => (
        <View key={i}>
          <Text>
            {value.categoryName} | {value.total}
          </Text>
        </View>
      ))}
      <Button title="save" onPress={() => onConfirm(categoryValues)} />
    </View>
  );
}
