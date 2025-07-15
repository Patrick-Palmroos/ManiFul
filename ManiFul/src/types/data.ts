import { ColorValue } from 'react-native';

export type PieData = {
  name: String;
  value: number;
  color: ColorValue;
};

export type TransactionData = {
  id: number;
  userId: number;
  total: number;
  date: string;
  items: TransactionItem[] | null;
};

export type TransactionItem = {
  id: number;
  typeId: number;
  name: string;
  total: number;
};

export type transactionPost = {
  total: number;
  vendor: string;
  date: string;
  items: TransactionPostItem[] | null;
};

export type TransactionPostItem = {
  type_id: number;
  name: string;
  total: number;
};
