export interface SummaryStats {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  savingsRate: number;   // 0–100 percentage
}

export interface CategoryTotal {
  category: string;
  total: number;
  percentage: number;
}

export interface MonthlyTotal {
  month: string;        // "MMM YYYY" e.g. "Jan 2025"
  income: number;
  expenses: number;
}
