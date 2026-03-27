"use client";

import { Transaction } from "@/types";

// DUMMY DATA
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

export default function TransactionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="font-display text-text-primary text-3xl font-bold">
          Transactions
        </h1>
        <button className="btn-primary">Add Transaction</button>
      </header>

      <div className="card-brutalist p-4">
        <p className="text-text-secondary text-sm">Filters shell...</p>
      </div>

      <div className="card-brutalist-lg">
        <p className="text-text-secondary mb-4">Transaction Table</p>
        <pre className="bg-bg-base text-text-primary overflow-auto rounded p-4 text-xs">
          {JSON.stringify(DUMMY_TRANSACTIONS, null, 2)}
        </pre>
      </div>
    </div>
  );
}
