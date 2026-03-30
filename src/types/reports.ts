import { CategoryTotal } from "./analytics";

export interface ReportSnapshot {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  savingsRate: number;
  topCategories: CategoryTotal[];
  transactionCount: number;
}

export interface MonthlyReport {
  id: string;
  user_id: string;
  month: number;
  year: number;
  report_json: ReportSnapshot;
  pdf_url?: string;
  email_sent: boolean;
  created_at: string;
}
