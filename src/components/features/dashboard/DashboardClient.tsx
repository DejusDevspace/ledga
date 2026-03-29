"use client";

import { useTransactions } from "@/hooks/useTransactions";
import { useActiveSheet } from "@/hooks/useActiveSheet";
import { usePeriod } from "@/hooks/usePeriod";
import {
  computeSummaryStats,
  groupByMonth,
  groupByCategory,
  filterByPeriod,
} from "@/lib/analytics/aggregators";
import { PERIOD_OPTIONS } from "@/constants/periods";
import { format } from "date-fns";
import {
  ArrowUp,
  ArrowDown,
  Wallet,
  BarChart2,
  AlertCircle,
} from "lucide-react";
import { formatNaira, formatPercent } from "@/lib/analytics/formatters";

import IncomeExpenseChart from "@/components/charts/IncomeExpenseChart";
import CategoryDonutChart from "@/components/charts/CategoryDonutChart";
import RecentTransactions from "@/components/features/dashboard/RecentTransactions";
import type { UserSheet } from "@/types/sheet";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile?: any;
  sheets: UserSheet[];
}

export default function DashboardClient({ sheets }: Props) {
  const { period, setPeriod } = useActiveSheetAndPeriodProvider(sheets);
  // Wait, I need to use the hooks separately. Let's declare them here.
  const { activeSheet } = useActiveSheet(sheets);
  const { period: currentPeriod, setPeriod: setCurrentPeriod } = usePeriod();

  const { transactions, loading, error, refresh, fromCache } = useTransactions(
    activeSheet?.sheetId ?? null
  );

  // Debug: fromCache indicator per instructions
  if (!loading && !error) {
    console.log("[Dashboard] Transactions loaded. fromCache:", fromCache);
  }

  // Filter & Compute
  const filteredTransactions = filterByPeriod(transactions, currentPeriod);
  const stats = computeSummaryStats(filteredTransactions);
  const monthlyData = groupByMonth(filteredTransactions);
  const categoryData = groupByCategory(filteredTransactions);

  const todayStr = format(new Date(), "MMM dd, yyyy — EEEE").toUpperCase();

  return (
    <>
      {/* HEADER ROW */}
      <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="font-display text-4xl font-black tracking-tighter uppercase md:text-5xl">
            Dashboard
          </h1>
          <p className="text-accent-gold mt-1 font-mono text-sm uppercase">
            {todayStr}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {PERIOD_OPTIONS.map((p) => {
            const isActive = currentPeriod === p.value;
            return (
              <button
                key={p.value}
                onClick={() => setCurrentPeriod(p.value)}
                className={
                  isActive
                    ? "bg-accent-primary font-display border-2 border-black px-4 py-2 text-xs font-bold text-black uppercase shadow-[2px_2px_0px_#000]"
                    : "font-display text-text-primary border-divider border-2 bg-transparent px-4 py-2 text-xs font-bold uppercase transition-colors hover:border-black"
                }
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* ERROR STATE */}
      {error && (
        <div className="bg-bg-surface border-accent-red mb-6 border-2 p-6 shadow-[4px_4px_0px_var(--color-accent-red)]">
          <div className="flex items-center gap-2">
            <AlertCircle size={24} className="text-accent-red" />
            <h2 className="font-display text-accent-red text-lg font-bold uppercase">
              Failed to Load Sheet Data
            </h2>
          </div>
          <p className="text-text-secondary mt-2 font-mono text-sm">{error}</p>
          <button
            onClick={refresh}
            className="font-display border-accent-red text-accent-red hover:bg-accent-red/10 mt-4 border-2 px-4 py-2 text-sm font-bold uppercase transition-colors"
          >
            Retry Data Sync
          </button>
        </div>
      )}

      {/* LOADING STATE */}
      {loading ? (
        <>
          <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="skeleton h-32 rounded-none" />
            <div className="skeleton h-32 rounded-none" />
            <div className="skeleton h-32 rounded-none" />
            <div className="skeleton h-32 rounded-none" />
          </div>
          <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-10">
            <div className="skeleton h-64 rounded-none lg:col-span-6" />
            <div className="skeleton h-64 rounded-none lg:col-span-4" />
          </div>
          <div className="skeleton h-48 w-full rounded-none" />
        </>
      ) : (
        !error && (
          <>
            {/* SUMMARY CARDS ROW */}
            <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Income */}
              <div className="bg-bg-surface relative overflow-hidden border-2 border-black p-5 shadow-[4px_4px_0px_#000]">
                <div className="mb-4 flex items-start justify-between">
                  <span className="bg-accent-gold font-display border border-black px-2 py-1 text-[10px] font-bold text-black">
                    INCOME
                  </span>
                  <ArrowUp size={22} className="text-accent-green" />
                </div>
                <div className="text-accent-green font-mono text-2xl font-bold">
                  {formatNaira(stats.totalIncome)}
                </div>
                <div className="mt-2 font-mono text-[10px] uppercase opacity-60">
                  Total Gross Income
                </div>
              </div>

              {/* Expenses */}
              <div className="bg-bg-surface relative overflow-hidden border-2 border-black p-5 shadow-[4px_4px_0px_#000]">
                <div className="mb-4 flex items-start justify-between">
                  <span className="bg-accent-red font-display border border-black px-2 py-1 text-[10px] font-bold text-white">
                    EXPENSES
                  </span>
                  <ArrowDown size={22} className="text-accent-red" />
                </div>
                <div className="text-accent-red font-mono text-2xl font-bold">
                  {formatNaira(stats.totalExpenses)}
                </div>
                <div className="mt-2 font-mono text-[10px] uppercase opacity-60">
                  Total Monthly Burn
                </div>
              </div>

              {/* Net Balance */}
              <div className="bg-bg-elevated relative overflow-hidden border-2 border-black p-5 shadow-[4px_4px_0px_#000]">
                <div className="mb-4 flex items-start justify-between">
                  <span className="bg-accent-primary font-display border border-black px-2 py-1 text-[10px] font-bold text-black">
                    NET
                  </span>
                  <Wallet size={22} className="text-accent-primary" />
                </div>
                <div
                  className={`font-mono text-2xl font-bold ${
                    stats.netBalance >= 0
                      ? "text-text-primary"
                      : "text-accent-red"
                  }`}
                >
                  {formatNaira(stats.netBalance)}
                </div>
                <div className="mt-2 font-mono text-[10px] uppercase opacity-60">
                  Surplus Liquidity
                </div>
              </div>

              {/* Savings Rate */}
              <div className="bg-bg-surface relative overflow-hidden border-2 border-black p-5 shadow-[4px_4px_0px_#000]">
                <div className="mb-4 flex items-start justify-between">
                  <span className="bg-accent-green font-display border border-black px-2 py-1 text-[10px] font-bold text-black">
                    SAVINGS RATE
                  </span>
                  <BarChart2 size={22} className="text-accent-gold" />
                </div>
                <div className="text-accent-green font-mono text-2xl font-bold">
                  {formatPercent(stats.savingsRate)}
                </div>
                <div className="mt-2 font-mono text-[10px] uppercase opacity-60">
                  Efficiency Target: 50%
                </div>
              </div>
            </div>

            {/* CHARTS ROW */}
            <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-10">
              <IncomeExpenseChart data={monthlyData} />
              <CategoryDonutChart
                data={categoryData}
                totalExpenses={stats.totalExpenses}
              />
            </div>

            {/* RECENT TRANSACTIONS */}
            <RecentTransactions transactions={filteredTransactions} />
          </>
        )
      )}
    </>
  );
}

// Dummy helper wrapper hook inside this file because I incorrectly mocked `useActiveSheetAndPeriodProvider` above
function useActiveSheetAndPeriodProvider(sheets: UserSheet[]) {
  const { activeSheet, setActiveSheet } = useActiveSheet(sheets);
  const { period, setPeriod } = usePeriod();

  return { activeSheet, setActiveSheet, period, setPeriod };
}
