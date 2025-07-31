export type Budget = {
  active: boolean;
  budgetTotal: number;
  items: BudgetItem[];
  month: number;
  year: number;
  repeating: boolean;
};

export type BudgetItem = {
  categoryId: number | null;
  typeId: number | null;
  amount: number;
};
