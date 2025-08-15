export type RepeatingBudget = {
  id: number;
  active: boolean;
  budgetTotal: number;
  items: BudgetItemType[];
  month: null;
  year: null;
  repeating: true;
};

export type BudgetType = {
  id: number;
  active: boolean;
  budgetTotal: number;
  items: BudgetItemType[];
  month: number;
  year: number;
  repeating: false;
};

export type AnyBudget = BudgetType | RepeatingBudget;

export type BudgetItemType = {
  categoryId: number | null;
  typeId: number | null;
  amount: number;
};

export type BudgetPostType =
  | {
      active: boolean;
      budgetTotal: number;
      items: BudgetItemType[];
      month: null;
      year: null;
      repeating: true;
    }
  | {
      active: boolean;
      budgetTotal: number;
      items: BudgetItemType[];
      month: number;
      year: number;
      repeating: false;
    };
