export type Category = {
  id: number;
  name: string;
  userId: number;
  types: Type[];
};

export type Type = {
  id: number;
  name: string;
  categoryId: number;
  expense: boolean;
  userId: number;
};
