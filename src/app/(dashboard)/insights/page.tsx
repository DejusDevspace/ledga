"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useUserSheets } from "@/hooks/useUserSheets";
import { useActiveSheet } from "@/hooks/useActiveSheet";
import { useTransactions } from "@/hooks/useTransactions";
import { usePeriod } from "@/hooks/usePeriod";
import { PERIOD_OPTIONS } from "@/constants/periods";
import { TRANSACTION_CATEGORIES } from "@/constants/categories";
import { ROUTES } from "@/constants/routes";
import { formatNaira } from "@/lib/analytics/formatters";
import {
  filterByPeriod,
  filterByType,
  groupByMonth,
  groupByCategory,
  getLargestTransactions,
} from "@/lib/analytics/aggregators";
import {
  BarChart2,
  Trophy,
  Activity,
  TrendingUp,
  Receipt,
  Filter,
} from "lucide-react";

import SpendingTrendChart from "@/components/charts/SpendingTrendChart";
import IncomeStabilityChart from "@/components/charts/IncomeStabilityChart";
import SavingsRateChart from "@/components/charts/SavingsRateChart";

export default function InsightsPage() {
  const { loading: sheetsLoading } = useUserSheets();
  const { activeSheet } = useActiveSheet();
  const { period, setPeriod } = usePeriod();
  const { transactions, loading: txLoading } = useTransactions(
    activeSheet?.sheetId ?? null
  );

  const loading = sheetsLoading || txLoading;

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Derived Data
  const filteredTx = useMemo(
    () => filterByPeriod([...transactions], period),
    [transactions, period]
  );
  const expensesOnly = useMemo(
    () => filterByType(filteredTx, "expense"),
    [filteredTx]
  );
  const incomeOnly = useMemo(
    () => filterByType(filteredTx, "income"),
    [filteredTx]
  );

  // Card 1
  const spendingTrendData = useMemo(
    () => groupByMonth(expensesOnly).slice(-6),
    [expensesOnly]
  );

  // Card 2
  const topCategories = useMemo(
    () => groupByCategory(filteredTx).slice(0, 5),
    [filteredTx]
  );

  // Card 3
  const incomeStabilityData = useMemo(
    () => groupByMonth(incomeOnly),
    [incomeOnly]
  );

  // Card 4
  const savingsRateData = useMemo(() => {
    return groupByMonth(filteredTx).map((m) => {
      const inc = m.income;
      const exp = m.expenses;
      const rate = inc > 0 ? ((inc - exp) / inc) * 100 : 0;
      return { month: m.month, savingsRate: Math.max(0, rate) };
    });
  }, [filteredTx]);

  // Card 5
  const largestTransactions = useMemo(
    () => getLargestTransactions(filteredTx, 5),
    [filteredTx]
  );

  // Card 6
  const categoryDrilldown = useMemo(() => {
    if (!selectedCategory) return { total: 0, txs: [] };
    const txsInCategory = filteredTx.filter(
      (t) => t.category === selectedCategory
    );
    const total = txsInCategory.reduce((acc, t) => acc + t.amount, 0);
    // top 5 by amount
    const topTxs = [...txsInCategory]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
    return { total, txs: topTxs };
  }, [filteredTx, selectedCategory]);

  const periodLabel =
    PERIOD_OPTIONS.find((p) => p.value === period)?.label || period;

  if (loading) {
    return (
      <div className="pointer-events-none min-h-screen p-6 opacity-50">
        <div className="skeleton mb-10 h-24 w-full" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="skeleton h-96 w-full" />
          <div className="skeleton h-96 w-full" />
          <div className="skeleton h-96 w-full" />
          <div className="skeleton h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="font-display text-text-primary mb-2 text-6xl leading-none font-black tracking-tighter uppercase">
            Insights
          </h1>
          <p className="text-accent-primary font-mono text-sm tracking-[0.2em] uppercase">
            Analytical Overview · {periodLabel}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {PERIOD_OPTIONS.map((p) => {
            const isActive = period === p.value;
            return (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* CARD 1: Monthly Spending Trend */}
        <section className="bg-bg-surface flex flex-col border-2 border-black p-6 shadow-[4px_4px_0px_#000] lg:col-span-1">
          <h2 className="font-display mb-6 flex items-center gap-2 text-xl font-bold uppercase">
            <BarChart2 className="text-accent-primary" size={24} />
            Monthly Spending Trend
          </h2>
          <p className="text-text-secondary mb-4 font-mono text-[10px] uppercase">
            Last 6 months of expenses by category
          </p>
          <SpendingTrendChart data={spendingTrendData} />
        </section>

        {/* CARD 2: Top Spending Categories */}
        <section className="bg-bg-surface flex flex-col border-2 border-black p-6 shadow-[4px_4px_0px_#000] lg:col-span-1">
          <h2 className="font-display mb-6 flex items-center gap-2 text-xl font-bold uppercase">
            <Trophy className="text-accent-gold" size={24} />
            Top Spending Categories
          </h2>
          <div className="space-y-4">
            {topCategories.length === 0 ? (
              <div className="text-text-secondary py-8 text-center font-mono text-sm">
                No expense data
              </div>
            ) : (
              topCategories.map((cat, idx) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex justify-between font-mono text-xs uppercase">
                    <span>
                      <span className="text-accent-gold font-bold">
                        {idx + 1}.{" "}
                      </span>
                      {cat.category}
                    </span>
                    <span className="text-accent-primary">
                      {formatNaira(cat.total)}
                    </span>
                  </div>
                  <div className="bg-bg-elevated h-6 border-2 border-black">
                    <div
                      className="bg-accent-gold h-full border-r-2 border-black transition-all duration-500"
                      style={{ width: `${Math.min(100, cat.percentage)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* CARD 3: Income Stability */}
        <section className="bg-bg-surface flex flex-col border-2 border-black p-6 shadow-[4px_4px_0px_#000] lg:col-span-1">
          <h2 className="font-display mb-6 flex items-center gap-2 text-xl font-bold uppercase">
            <Activity className="text-accent-green" size={24} />
            Income Stability
          </h2>
          <IncomeStabilityChart data={incomeStabilityData} />
        </section>

        {/* CARD 4: Savings Rate Over Time */}
        <section className="bg-bg-surface flex flex-col border-2 border-black p-6 shadow-[4px_4px_0px_#000] lg:col-span-1">
          <h2 className="font-display mb-6 flex items-center gap-2 text-xl font-bold uppercase">
            <TrendingUp className="text-accent-green" size={24} />
            Savings Rate Over Time
          </h2>
          <SavingsRateChart data={savingsRateData} />
        </section>

        {/* CARD 5: Largest Transactions */}
        <section className="bg-bg-surface flex flex-col border-2 border-black p-6 shadow-[4px_4px_0px_#000] lg:col-span-1">
          <h2 className="font-display mb-6 flex items-center gap-2 text-xl font-bold uppercase">
            <Receipt className="text-accent-primary" size={24} />
            Largest Transactions
          </h2>
          {largestTransactions.length === 0 ? (
            <div className="text-text-secondary py-16 text-center font-mono text-sm">
              No transactions yet
            </div>
          ) : (
            <div className="chart-clean-zone overflow-x-auto border-none bg-transparent">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-text-secondary/50 text-text-secondary border-b-2 text-left font-mono text-[10px] uppercase">
                    <th className="pb-2">Merchant/Description</th>
                    <th className="pb-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-sm">
                  {largestTransactions.map((t) => {
                    const isIncome = t.type === "income";
                    return (
                      <tr key={t.id} className="border-divider/30 border-b">
                        <td className="max-w-45 overflow-hidden py-3 text-ellipsis whitespace-nowrap uppercase">
                          {t.description}
                        </td>
                        <td
                          className={`py-3 text-right font-bold ${
                            isIncome ? "text-accent-green" : "text-accent-red"
                          }`}
                        >
                          {isIncome ? "+" : "-"}
                          {formatNaira(t.amount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* CARD 6: Category Drill-down */}
        <section className="bg-bg-surface flex flex-col border-2 border-black p-6 shadow-[4px_4px_0px_#000] lg:col-span-1">
          <h2 className="font-display mb-6 flex items-center gap-2 text-xl font-bold uppercase">
            <Filter className="text-accent-gold" size={24} />
            Category Drill-down
          </h2>

          <div className="mb-8 flex flex-wrap gap-3">
            {TRANSACTION_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(isActive ? null : cat)}
                  className={`font-display border-2 border-black px-4 py-2 text-xs font-bold uppercase transition-colors ${
                    isActive
                      ? "bg-accent-primary translate-x-0.5 translate-y-0.5 text-black shadow-[4px_4px_0px_#000]"
                      : "bg-bg-elevated hover:bg-bg-surface text-white"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {!selectedCategory ? (
            <div className="text-text-secondary py-8 text-center font-mono text-sm">
              Select a category above to explore its transactions
            </div>
          ) : (
            <div className="bg-bg-elevated border-2 border-black p-4 shadow-[inset_4px_4px_0px_rgba(0,0,0,0.5)]">
              <div className="mb-4 flex items-start justify-between">
                <div className="text-accent-primary font-mono text-[10px] uppercase">
                  Focus: {selectedCategory}
                </div>
                <div className="text-accent-red font-mono text-xl font-bold">
                  {formatNaira(categoryDrilldown.total)}
                </div>
              </div>

              <div className="space-y-2">
                {categoryDrilldown.txs.length === 0 ? (
                  <div className="text-text-secondary font-mono text-xs opacity-70">
                    No transactions
                  </div>
                ) : (
                  categoryDrilldown.txs.map((t) => (
                    <div
                      key={t.id}
                      className="flex justify-between font-mono text-xs opacity-70"
                    >
                      <span className="max-w-[70%] overflow-hidden text-ellipsis whitespace-nowrap">
                        {t.description}
                      </span>
                      <span>{formatNaira(t.amount)}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-4">
                <Link
                  href={`${ROUTES.TRANSACTIONS}?category=${selectedCategory}`}
                  className="text-accent-primary font-mono text-xs hover:underline"
                >
                  View all in Transactions →
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
