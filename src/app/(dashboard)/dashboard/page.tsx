import { SummaryStats, Transaction } from "@/types";

// DUMMY DATA — replace with real fetch
const DUMMY_STATS: SummaryStats = {
  totalIncome: 1250000,
  totalExpenses: 850000,
  netBalance: 400000,
  savingsRate: 32,
};

const DUMMY_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    date: "2025-01-15",
    type: "income",
    category: "Salary/Freelance",
    description: "Design Retainer",
    amount: 1250000,
  },
  {
    id: "2",
    date: "2025-01-16",
    type: "expense",
    category: "Food & Groceries",
    description: "Supermarket",
    amount: 45000,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="font-display text-text-primary text-3xl font-bold">
          Dashboard
        </h1>
        {/* TODO: PeriodSelector */}
        <select className="input-brutalist w-full sm:w-48">
          <option>This Month</option>
          <option>Last 3 Months</option>
          <option>This Year</option>
        </select>
      </header>

      {/* DUMMY SHELL */}
      <div className="card-brutalist-lg">
        <p className="text-text-secondary mb-4">Summary Stats</p>
        <pre className="bg-bg-base text-text-primary overflow-auto rounded p-4 text-xs">
          {JSON.stringify(DUMMY_STATS, null, 2)}
        </pre>
      </div>

      <div className="card-brutalist-lg">
        <p className="text-text-secondary mb-4">Recent Transactions</p>
        <pre className="bg-bg-base text-text-primary overflow-auto rounded p-4 text-xs">
          {JSON.stringify(DUMMY_TRANSACTIONS, null, 2)}
        </pre>
      </div>
    </div>
  );
}
