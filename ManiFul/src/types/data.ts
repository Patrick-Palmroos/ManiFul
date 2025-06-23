import { ColorValue } from 'react-native';

export type PieData = {
  value: number;
  color: ColorValue | null;
};

export type TransactionData = {
  id: number;
  title: String;
  data: {
    id: number;
    name: String;
    total: number;
  };
};
