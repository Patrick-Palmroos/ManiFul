export type BudgetType = {
  id: number;
  active: boolean;
  budgetTotal: number;
  items: BudgetItemType[];
  month: number;
  year: number;
  repeating: boolean;
};

export type BudgetItemType = {
  categoryId: number | null;
  typeId: number | null;
  amount: number;
};

export type BudgetPostType = {
  active: boolean;
  budgetTotal: number;
  items: BudgetItemType[];
  month: number;
  year: number;
  repeating: boolean;
};
