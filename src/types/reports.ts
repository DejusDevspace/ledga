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
  userId: string;
  month: number;
  year: number;
  reportJson: ReportSnapshot;
  pdfUrl?: string;
  emailSent: boolean;
  createdAt: string;
}
