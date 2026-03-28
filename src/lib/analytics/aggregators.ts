import {
  Transaction,
  SummaryStats,
  CategoryTotal,
  MonthlyTotal,
} from "@/types";
import { PeriodValue } from "@/constants/periods";

// ─── 1. Summary Stats ──────────────────────────────────────

export function computeSummaryStats(
  transactions: Transaction[]
): SummaryStats {
  let totalIncome = 0;
  let totalExpenses = 0;

  for (const t of transactions) {
    if (t.type === "income") totalIncome += t.amount;
    else totalExpenses += t.amount;
  }

  const netBalance = totalIncome - totalExpenses;
  const savingsRate =
    totalIncome === 0
      ? 0
      : Math.round(((netBalance / totalIncome) * 100) * 10) / 10;

  return { totalIncome, totalExpenses, netBalance, savingsRate };
}

// ─── 2. Group by Category ───────────────────────────────────

export function groupByCategory(
  transactions: Transaction[]
): CategoryTotal[] {
  const expenses = transactions.filter((t) => t.type === "expense");
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

  if (totalExpenses === 0) return [];

  const map = new Map<string, number>();
  for (const t of expenses) {
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
  }

  return Array.from(map.entries())
    .map(([category, total]) => ({
      category,
      total,
      percentage: Math.round(((total / totalExpenses) * 100) * 10) / 10,
    }))
    .sort((a, b) => b.total - a.total);
}

// ─── 3. Group by Month ─────────────────────────────────────

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function groupByMonth(
  transactions: Transaction[]
): MonthlyTotal[] {
  const map = new Map<string, { income: number; expenses: number; sortKey: string }>();

  for (const t of transactions) {
    const d = new Date(t.date);
    const monthIdx = d.getMonth();
    const year = d.getFullYear();
    const label = `${MONTH_LABELS[monthIdx]} ${year}`;
    const sortKey = `${year}-${String(monthIdx).padStart(2, "0")}`;

    if (!map.has(label)) {
      map.set(label, { income: 0, expenses: 0, sortKey });
    }
    const entry = map.get(label)!;
    if (t.type === "income") entry.income += t.amount;
    else entry.expenses += t.amount;
  }

  return Array.from(map.entries())
    .sort((a, b) => a[1].sortKey.localeCompare(b[1].sortKey))
    .map(([month, { income, expenses }]) => ({ month, income, expenses }));
}

// ─── 4. Filter by Period ────────────────────────────────────

export function filterByPeriod(
  transactions: Transaction[],
  period: PeriodValue
): Transaction[] {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  switch (period) {
    case "this_month":
      return transactions.filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });

    case "last_3_months": {
      const threeMonthsAgo = new Date(currentYear, currentMonth - 2, 1);
      return transactions.filter((t) => {
        const d = new Date(t.date);
        return d >= threeMonthsAgo;
      });
    }

    case "this_year":
      return transactions.filter((t) => {
        const d = new Date(t.date);
        return d.getFullYear() === currentYear;
      });

    case "custom":
      return transactions;
  }
}

// ─── 5. Filter by Date Range ────────────────────────────────

export function filterByDateRange(
  transactions: Transaction[],
  from: string,
  to: string
): Transaction[] {
  return transactions.filter((t) => t.date >= from && t.date <= to);
}

// ─── 6. Filter by Type ─────────────────────────────────────

export function filterByType(
  transactions: Transaction[],
  type: "income" | "expense" | "all"
): Transaction[] {
  if (type === "all") return transactions;
  return transactions.filter((t) => t.type === type);
}

// ─── 7. Filter by Categories ────────────────────────────────

export function filterByCategories(
  transactions: Transaction[],
  categories: string[]
): Transaction[] {
  if (categories.length === 0) return transactions;
  return transactions.filter((t) => categories.includes(t.category));
}

// ─── 8. Search by Description ───────────────────────────────

export function searchByDescription(
  transactions: Transaction[],
  query: string
): Transaction[] {
  if (!query) return transactions;
  const lower = query.toLowerCase();
  return transactions.filter((t) =>
    t.description.toLowerCase().includes(lower)
  );
}

// ─── 9. Sort Transactions ───────────────────────────────────

export function sortTransactions(
  transactions: Transaction[],
  sortBy: keyof Transaction = "date",
  direction: "asc" | "desc" = "desc"
): Transaction[] {
  const copy = [...transactions];

  copy.sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];

    let cmp: number;
    if (typeof valA === "number" && typeof valB === "number") {
      cmp = valA - valB;
    } else {
      cmp = String(valA).localeCompare(String(valB));
    }

    return direction === "asc" ? cmp : -cmp;
  });

  return copy;
}

// ─── 10. Largest Transactions ───────────────────────────────

export function getLargestTransactions(
  transactions: Transaction[],
  limit: number = 5
): Transaction[] {
  return [...transactions].sort((a, b) => b.amount - a.amount).slice(0, limit);
}

// ─── 11. Month-over-Month Change ────────────────────────────

export function computeMonthOverMonthChange(
  transactions: Transaction[]
): { income: number; expenses: number } {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const prevMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const prevYear = thisMonth === 0 ? thisYear - 1 : thisYear;

  let currIncome = 0,
    currExpenses = 0,
    prevIncome = 0,
    prevExpenses = 0;

  for (const t of transactions) {
    const d = new Date(t.date);
    const m = d.getMonth();
    const y = d.getFullYear();

    if (m === thisMonth && y === thisYear) {
      if (t.type === "income") currIncome += t.amount;
      else currExpenses += t.amount;
    } else if (m === prevMonth && y === prevYear) {
      if (t.type === "income") prevIncome += t.amount;
      else prevExpenses += t.amount;
    }
  }

  const incomeChange =
    prevIncome === 0
      ? 0
      : Math.round(((currIncome - prevIncome) / prevIncome) * 1000) / 10;
  const expensesChange =
    prevExpenses === 0
      ? 0
      : Math.round(((currExpenses - prevExpenses) / prevExpenses) * 1000) / 10;

  return { income: incomeChange, expenses: expensesChange };
}
