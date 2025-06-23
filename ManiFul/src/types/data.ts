import { ColorValue } from 'react-native';

export type PieData = {
  name: String;
  value: number;
  color: ColorValue;
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
