export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;        // generated client-side (row index as string)
  date: string;        // ISO date string "YYYY-MM-DD"
  type: TransactionType;
  category: string;
  description: string;
  amount: number;        // always positive, type determines sign
}

export interface TransactionFilters {
  dateFrom?: string;
  dateTo?: string;
  type?: TransactionType | "all";
  categories?: string[];
  search?: string;
  sortBy?: keyof Transaction;
  sortDir?: "asc" | "desc";
}
