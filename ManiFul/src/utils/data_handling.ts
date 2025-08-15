type ChosenCategoryValues = {
  categoryId: number;
  categoryName: string;
  total: number;
};

type CategoryLike = {
  id: number;
  name: string;
};

export function distributeCategoryTotals(
  categories: CategoryLike[],
  total: number,
): ChosenCategoryValues[] {
  if (categories.length === 0) return [];

  // Equal initial split
  const baseAmount = Number((total / categories.length).toFixed(2));

  let distributed = categories.map(cat => ({
    categoryId: cat.id,
    categoryName: cat.name,
    total: baseAmount,
  }));

  // Adjust rounding difference
  const currentSum = distributed.reduce((sum, c) => sum + c.total, 0);
  let roundingDifference = Number((total - currentSum).toFixed(2));

  for (
    let i = 0;
    Math.abs(roundingDifference) >= 0.01 && i < distributed.length;
    i++
  ) {
    const adjustment = roundingDifference > 0 ? 0.01 : -0.01;
    distributed[i].total = Number(
      (distributed[i].total + adjustment).toFixed(2),
    );
    roundingDifference = Number((roundingDifference - adjustment).toFixed(2));
  }

  return distributed;
}
