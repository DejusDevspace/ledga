export const TRANSACTION_CATEGORIES = [
  "Food & Groceries",
  "Transport",
  "Network/Internet",
  "Salary/Freelance",
  "Health",
  "Utilities",
  "Entertainment",
  "Education",
  "Other",
] as const;

export type TransactionCategory =
  typeof TRANSACTION_CATEGORIES[number];
