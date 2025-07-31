export function isCurrentMonthAndYear(month: number, year: number): boolean {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  return currentMonth === month && currentYear === year;
}
