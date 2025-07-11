import { ColorValue } from 'react-native';

export type PieData = {
  name: String;
  value: number;
  color: ColorValue;
};

export type TransactionData = {
  id: number;
  title: String;
  userId: number;
  total: number;
  date: string;
  items: TransactionItem[] | null;
};

export type TransactionItem = {
  id: number;
  typeId: number;
  name: String;
  total: number;
};
