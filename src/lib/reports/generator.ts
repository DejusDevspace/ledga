import type { Transaction } from "@/types";
import type { ReportSnapshot } from "@/types/reports";
import {
  computeSummaryStats,
  groupByCategory,
} from "@/lib/analytics/aggregators";

/**
 * Builds a ReportSnapshot from an array of transactions.
 * This is a pure function that calculates core financial metrics
 * used in the monthly reports.
 */
export function buildReportSnapshot(
  transactions: Transaction[]
): ReportSnapshot {
  const stats = computeSummaryStats(transactions);
  const topCategories = groupByCategory(transactions).slice(0, 5);

  return {
    totalIncome:      stats.totalIncome,
    totalExpenses:    stats.totalExpenses,
    netBalance:       stats.netBalance,
    savingsRate:      stats.savingsRate,
    topCategories,
    transactionCount: transactions.length,
  };
}
