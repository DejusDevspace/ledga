"use client";

import { useState, useMemo } from "react";
import { useUserSheets } from "@/hooks/useUserSheets";
import { useActiveSheet } from "@/hooks/useActiveSheet";
import { useTransactions } from "@/hooks/useTransactions";
import { usePeriod } from "@/hooks/usePeriod";
import {
  filterByPeriod,
  filterByDateRange,
  filterByType,
  filterByCategories,
  searchByDescription,
  sortTransactions,
} from "@/lib/analytics/filters";
import { formatNaira, formatDate } from "@/lib/analytics/formatters";
import { getCategoryColor, getCategoryColorRGBA } from "@/lib/analytics/colors";
import type { Transaction } from "@/types";
import {
  Download,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Search,
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function TransactionsClient() {
  const { loading: sheetsLoading } = useUserSheets();
  const { activeSheet } = useActiveSheet();
  const { period, setPeriod } = usePeriod();
  const {
    transactions,
    categories: availableCategories,
    loading: txLoading,
  } = useTransactions(activeSheet?.sheetId ?? null);

  const loading = sheetsLoading || txLoading;

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [type, setType] = useState<"all" | "income" | "expense">("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof Transaction>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...transactions];

    if (dateFrom && dateTo) {
      result = filterByDateRange(result, dateFrom, dateTo);
    } else {
      result = filterByPeriod(result, period);
    }

    result = filterByType(result, type);

    if (selectedCategories.length > 0) {
      result = filterByCategories(result, selectedCategories);
    }

    result = searchByDescription(result, search);
    result = sortTransactions(result, sortBy, sortDir);

    return result;
  }, [
    transactions,
    period,
    dateFrom,
    dateTo,
    type,
    selectedCategories,
    search,
    sortBy,
    sortDir,
  ]);

  const filteredCount = filtered.length;
  const filteredTotal = filtered.reduce((acc, t) => acc + t.amount, 0);

  const totalPages = Math.max(1, Math.ceil(filteredCount / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleExportCSV = () => {
    const headers = ["Date", "Type", "Category", "Description", "Amount"];
    const rows = filtered.map((t) => [
      t.date,
      t.type,
      t.category,
      t.description.replace(/,/g, ""),
      t.amount,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ledga-transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setDateFrom("");
    setDateTo("");
    setType("all");
    setSelectedCategories([]);
    setSearch("");
    setSortBy("date");
    setSortDir("desc");
    setPage(1);
    setPeriod("this_month");
  };

  const handleSort = (col: keyof Transaction) => {
    if (sortBy === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortDir("desc");
    }
    setPage(1);
  };

  const toggleCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "ALL") {
      setSelectedCategories([]);
    } else {
      if (!selectedCategories.includes(val)) {
        setSelectedCategories([...selectedCategories, val]);
      } else {
        setSelectedCategories(selectedCategories.filter((c) => c !== val));
      }
    }
    setPage(1);
  };

  return (
    <div className="min-h-screen">
      <header className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="font-display text-text-primary mb-2 text-5xl leading-none font-black tracking-tighter uppercase md:text-7xl">
            Transactions
          </h1>
          <p className="text-accent-green font-mono text-sm font-bold tracking-widest uppercase">
            Showing {filteredCount} transactions · {formatNaira(filteredTotal)}{" "}
            total
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="bg-bg-surface text-accent-primary font-display flex items-center gap-2 border-2 border-black px-6 py-3 font-bold tracking-tighter uppercase shadow-[4px_4px_0px_#000] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          <Download size={18} />
          Export CSV
        </button>
      </header>

      <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <label className="text-text-secondary mb-1 block px-1 font-mono text-[10px] uppercase">
            Date range
          </label>
          <div className="bg-bg-elevated text-text-primary focus-within:border-accent-primary flex w-full items-center border-2 border-black p-3 text-sm shadow-[2px_2px_0px_#000] focus-within:ring-0">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPeriod("custom");
                setPage(1);
              }}
              className="w-full bg-transparent outline-none"
            />
            <span className="mx-2">→</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPeriod("custom");
                setPage(1);
              }}
              className="w-full bg-transparent outline-none"
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <label className="text-text-secondary mb-1 block px-1 font-mono text-[10px] uppercase">
            Type
          </label>
          <div className="relative">
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value as "all" | "income" | "expense");
                setPage(1);
              }}
              className="bg-bg-elevated text-text-primary focus:border-accent-primary w-full appearance-none border-2 border-black p-3 font-mono text-sm shadow-[2px_2px_0px_#000] focus:ring-0"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <ChevronDown
              size={18}
              className="text-text-secondary pointer-events-none absolute top-3 right-3"
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <label className="text-text-secondary mb-1 block px-1 font-mono text-[10px] uppercase">
            Category
          </label>
          <div className="relative">
            <select
              onChange={toggleCategory}
              value="DEFAULT"
              className="bg-bg-elevated text-text-primary focus:border-accent-primary w-full appearance-none border-2 border-black p-3 font-mono text-sm shadow-[2px_2px_0px_#000] focus:ring-0"
            >
              <option value="DEFAULT" disabled>
                {selectedCategories.length > 0
                  ? `${selectedCategories.length} Selected`
                  : "All Categories"}
              </option>
              <option value="ALL">Clear selection</option>
              {availableCategories.map((c) => (
                <option key={c} value={c}>
                  {selectedCategories.includes(c) ? "✓ " : ""}
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              className="text-text-secondary pointer-events-none absolute top-3 right-3"
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <label className="text-text-secondary mb-1 block px-1 font-mono text-[10px] uppercase">
            Description
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search descriptions..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="bg-bg-elevated text-text-primary focus:border-accent-primary w-full border-2 border-black p-3 font-mono text-sm shadow-[2px_2px_0px_#000] focus:ring-0"
            />
            <Search
              size={18}
              className="text-text-secondary absolute top-3 right-3"
            />
          </div>
        </div>
      </section>

      <div className="mb-4">
        <button
          onClick={clearFilters}
          className="text-text-secondary hover:text-text-primary cursor-pointer font-mono text-[10px] uppercase"
        >
          Clear Filters
        </button>
      </div>

      <div className="bg-bg-surface overflow-hidden border-2 border-black shadow-[6px_6px_0px_#000]">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-bg-elevated border-b-2 border-black">
                {[
                  { key: "date", label: "Date" },
                  { key: "type", label: "Type" },
                  { key: "category", label: "Category" },
                  { key: "description", label: "Description" },
                  { key: "amount", label: "Amount", align: "right" },
                ].map((col) => {
                  const isActive = sortBy === col.key;
                  return (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key as keyof Transaction)}
                      className={`font-display text-text-secondary hover:text-text-primary cursor-pointer p-4 text-xs font-bold tracking-tighter uppercase ${
                        col.align === "right" ? "text-right" : ""
                      }`}
                    >
                      <div
                        className={`flex items-center gap-1 ${
                          col.align === "right" ? "justify-end" : ""
                        }`}
                      >
                        {col.label}
                        {isActive ? (
                          sortDir === "desc" ? (
                            <ChevronDown
                              size={16}
                              className="text-accent-primary"
                            />
                          ) : (
                            <ChevronUp
                              size={16}
                              className="text-accent-primary"
                            />
                          )
                        ) : (
                          <ChevronsUpDown
                            size={16}
                            className="text-text-secondary"
                          />
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="font-body text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-4">
                    <div className="skeleton h-12 w-full"></div>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="text-text-secondary py-16 text-center">
                      <Search size={48} className="mx-auto mb-4" />
                      <h4 className="font-display font-bold tracking-tighter uppercase">
                        No Transactions Found
                      </h4>
                      <p className="mt-2 font-mono text-sm">
                        Try adjusting your filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((t, idx) => {
                  const isIncome = t.type === "income";
                  const bgClass =
                    idx % 2 === 0 ? "bg-[#16213E]" : "bg-bg-surface";
                  return (
                    <tr
                      key={t.id + idx}
                      className={`${bgClass} hover:bg-bg-elevated border-b-2 border-black transition-colors`}
                    >
                      <td className="p-4 font-mono">{formatDate(t.date)}</td>
                      <td className="p-4">
                        <span
                          className={`border px-2 py-1 text-[10px] font-bold uppercase ${
                            isIncome
                              ? "border-accent-gold bg-accent-gold/20 text-accent-gold"
                              : "border-accent-red bg-accent-red/20 text-accent-red"
                          }`}
                        >
                          {t.type}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className="border px-2 py-1 text-xs font-bold uppercase transition-all"
                          style={{
                            backgroundColor: getCategoryColorRGBA(
                              t.category,
                              0.2
                            ),
                            borderColor: getCategoryColor(t.category),
                            color: getCategoryColor(t.category),
                          }}
                        >
                          {t.category}
                        </span>
                      </td>
                      <td className="text-text-primary p-4 font-medium">
                        {t.description}
                      </td>
                      <td
                        className={`p-4 text-right font-mono font-bold ${
                          isIncome ? "text-accent-green" : "text-accent-red"
                        }`}
                      >
                        {isIncome ? "+ " : "- "}
                        {formatNaira(t.amount)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-bg-elevated flex items-center justify-between border-t-2 border-black p-4">
          <p className="text-text-secondary font-mono text-[10px] uppercase">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="bg-bg-surface text-text-secondary font-display border-2 border-black px-4 py-2 text-xs font-bold tracking-tighter uppercase disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="bg-accent-primary font-display border-2 border-black px-4 py-2 text-xs font-bold tracking-tighter text-black uppercase shadow-[2px_2px_0px_#000] transition-all active:translate-x-px active:translate-y-px active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-[2px_2px_0px_#000]"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
