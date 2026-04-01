"use client";

import { useState } from "react";
import { BarChart2, FileText, X, Loader2 } from "lucide-react";
import { MonthlyReport } from "@/types/reports";
import { formatNaira } from "@/lib/analytics/formatters";
import { useReports } from "@/hooks/useReports";

interface Props {
  initialReports: MonthlyReport[];
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function ReportsClient({ initialReports }: Props) {
  const { reports, refreshReports } = useReports(initialReports);

  // UI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generateSuccess, setGenerateSuccess] = useState<string | null>(null);
  const [selectedModalReport, setSelectedModalReport] =
    useState<MonthlyReport | null>(null);

  // Custom Report state
  const now = new Date();
  const [customMonth, setCustomMonth] = useState(now.getMonth() + 1); // 1-indexed
  const [customYear, setCustomYear] = useState(now.getFullYear());

  // Current Month logic
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const currentReport = reports.find(
    (r) => r.month === currentMonth && r.year === currentYear
  );

  const handleGenerate = async (month?: number, year?: number) => {
    setIsGenerating(true);
    setGenerateError(null);
    setGenerateSuccess(null);

    try {
      const res = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, year }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");

      await refreshReports();

      const targetMonth =
        month || new Date(now.getFullYear(), now.getMonth() - 1).getMonth() + 1;
      setGenerateSuccess(
        `Report generated for ${MONTH_NAMES[targetMonth - 1]} ${year || now.getFullYear()}`
      );
    } catch (err) {
      setGenerateError(
        err instanceof Error ? err.message : "Generation failed"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6 md:p-12">
      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <header className="border-accent-primary relative mb-12 border-b-4 pb-8">
        <h1 className="font-display text-text-primary text-5xl font-black tracking-tighter uppercase md:text-7xl">
          Monthly Reports
        </h1>

        {/* Accent overlay (decorative) */}
        <div className="bg-accent-primary pointer-events-none absolute -bottom-1 left-0 h-4 w-32 opacity-50 mix-blend-multiply" />

        <div className="mt-4 flex flex-wrap gap-4">
          <div className="bg-bg-surface text-accent-gold border-2 border-black p-2 font-mono text-sm uppercase shadow-[2px_2px_0px_#000]">
            Fiscal Year {currentYear}
          </div>
          <div className="bg-bg-surface text-accent-green border-2 border-black p-2 font-mono text-sm uppercase shadow-[2px_2px_0px_#000]">
            Auto-generated Monthly
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => handleGenerate()}
            disabled={isGenerating}
            className="bg-bg-surface text-accent-primary font-display flex items-center gap-2 border-2 border-black px-6 py-3 font-bold tracking-tighter uppercase shadow-[4px_4px_0px_#000] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <BarChart2 size={18} />
            )}
            {isGenerating ? "Generating..." : "Generate Last Month's Report"}
          </button>

          {generateSuccess && (
            <p className="text-accent-green mt-2 font-mono text-sm">
              {generateSuccess}
            </p>
          )}
          {generateError && (
            <p className="text-accent-red mt-2 font-mono text-sm">
              {generateError}
            </p>
          )}
        </div>
      </header>

      {/* ── REPORTS GRID ─────────────────────────────────────────────────── */}
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* ITEM 1: CURRENT MONTH STATUS */}
        {currentReport ? (
          <ReportCard
            report={currentReport}
            onOpenModal={setSelectedModalReport}
            isCurrent
          />
        ) : (
          <InProgressCard
            currentMonth={currentMonth}
            currentYear={currentYear}
          />
        )}

        {/* COMPLETED REPORTS */}
        {reports
          .filter((r) => !(r.month === currentMonth && r.year === currentYear))
          .map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onOpenModal={setSelectedModalReport}
            />
          ))}

        {/* LAST ITEM: CUSTOM GENERATOR */}
        <CustomReportCard
          month={customMonth}
          year={customYear}
          onMonthChange={setCustomMonth}
          onYearChange={setCustomYear}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
      </div>

      {reports.length === 0 && !currentReport && (
        <div className="py-24 text-center">
          <FileText size={64} className="text-text-secondary mx-auto mb-6" />
          <h4 className="font-display text-text-secondary text-3xl font-black uppercase">
            No Reports Yet
          </h4>
          <p className="text-text-secondary mt-4 font-mono text-sm">
            Your first report will be automatically generated on the 1st of next
            month.
          </p>
        </div>
      )}

      {/* ── MODAL ────────────────────────────────────────────────────────── */}
      {selectedModalReport && (
        <ReportModal
          report={selectedModalReport}
          onClose={() => setSelectedModalReport(null)}
        />
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   SUB-COMPONENTS
   ────────────────────────────────────────────────────────────────────────── */

function ReportCard({
  report,
  onOpenModal,
  isCurrent,
}: {
  report: MonthlyReport;
  onOpenModal: (r: MonthlyReport) => void;
  isCurrent?: boolean;
}) {
  const { report_json: data } = report;

  return (
    <div className="bg-bg-surface group relative border-2 border-black p-6 shadow-[4px_4px_0px_#000] transition-all hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000]">
      {isCurrent && (
        <div className="bg-accent-primary absolute top-3 right-3 z-10 border border-black px-2 py-1 text-[10px] font-bold text-black uppercase">
          Current Month
        </div>
      )}

      <div className="mb-6 flex items-start justify-between">
        <h3 className="font-display text-2xl font-bold tracking-tight uppercase">
          {MONTH_NAMES[report.month - 1]} {report.year}
        </h3>
        <FileText
          className="text-accent-primary transition-transform group-hover:scale-110"
          size={24}
        />
      </div>

      <div className="mb-8 space-y-4">
        <div className="border-divider flex items-baseline justify-between border-b pb-2">
          <span className="font-mono text-xs uppercase opacity-60">Income</span>
          <span className="text-accent-green font-mono text-lg">
            {formatNaira(data.totalIncome)}
          </span>
        </div>
        <div className="border-divider flex items-baseline justify-between border-b pb-2">
          <span className="font-mono text-xs uppercase opacity-60">
            Expenses
          </span>
          <span className="text-accent-red font-mono text-lg">
            {formatNaira(data.totalExpenses)}
          </span>
        </div>
        <div className="flex items-baseline justify-between pt-2">
          <span className="text-text-primary font-mono text-xs font-bold uppercase">
            Net Balance
          </span>
          <span
            className={`font-mono text-xl font-bold ${data.netBalance >= 0 ? "text-accent-primary" : "text-accent-red"}`}
          >
            {formatNaira(data.netBalance)}
          </span>
        </div>
        <div className="text-text-secondary mt-2 text-right font-mono text-[10px] uppercase">
          Savings rate: {data.savingsRate}%
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          disabled
          title="PDF export coming soon"
          className="border-divider font-display text-text-secondary cursor-not-allowed border-2 px-4 py-2 text-xs font-bold tracking-widest uppercase opacity-50"
        >
          Download PDF
        </button>
        <button
          onClick={() => onOpenModal(report)}
          className="bg-accent-primary font-display border-2 border-black px-4 py-2 text-xs font-bold tracking-widest text-black uppercase transition-all hover:shadow-[2px_2px_0px_#000] active:translate-y-1 active:shadow-none"
        >
          View Report
        </button>
      </div>
    </div>
  );
}

function InProgressCard({
  currentMonth,
  currentYear,
}: {
  currentMonth: number;
  currentYear: number;
}) {
  // Logic for next month name
  const nextMonthDate = new Date(currentYear, currentMonth, 1);
  const nextMonthName = MONTH_NAMES[nextMonthDate.getMonth()];

  return (
    <div className="bg-bg-surface relative overflow-hidden border-2 border-black p-6 shadow-[4px_4px_0px_#000]">
      <div className="bg-accent-primary absolute top-3 right-3 border border-black px-2 py-1 text-[10px] font-bold text-black uppercase">
        In Progress
      </div>

      <h3 className="font-display mb-2 text-2xl font-bold tracking-tight uppercase">
        {MONTH_NAMES[currentMonth - 1]} {currentYear}
      </h3>

      <p className="text-text-secondary mb-6 font-mono text-xs">
        Month in progress — report auto-generates on the 1st
      </p>

      <div className="flex gap-1">
        <div className="bg-accent-primary h-3 w-3 animate-pulse border border-black delay-0" />
        <div className="bg-accent-primary h-3 w-3 animate-pulse border border-black delay-150" />
        <div className="bg-accent-primary h-3 w-3 animate-pulse border border-black delay-300" />
      </div>

      <p className="text-text-secondary mt-4 font-mono text-[10px]">
        Transactions are being recorded.
        <br />
        Your report will be ready on 1 {nextMonthName}.
      </p>
    </div>
  );
}

function CustomReportCard({
  month,
  year,
  onMonthChange,
  onYearChange,
  onGenerate,
  isGenerating,
}: {
  month: number;
  year: number;
  onMonthChange: (m: number) => void;
  onYearChange: (y: number) => void;
  onGenerate: (m: number, y: number) => void;
  isGenerating: boolean;
}) {
  const years = Array.from(
    { length: 6 },
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <div className="bg-accent-gold flex min-h-[300px] flex-col items-center justify-center border-2 border-black p-6 text-center text-black shadow-[4px_4px_0px_rgba(0,0,0,0.5)] transition-all hover:translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000]">
      <div className="mb-6 border-4 border-black p-4">
        <BarChart2 size={48} />
      </div>

      <h3 className="font-display mb-4 text-2xl font-black tracking-tighter uppercase">
        Generate Custom Report
      </h3>

      <p className="font-body mb-6 px-4 text-xs font-bold uppercase">
        Manually trigger a report for any past month
      </p>

      <div className="mb-3 grid w-full grid-cols-2 gap-2">
        <select
          value={month}
          onChange={(e) => onMonthChange(parseInt(e.target.value))}
          className="border-2 border-black bg-white p-2 font-mono text-sm focus:outline-none"
        >
          {MONTH_NAMES.map((m, i) => (
            <option key={m} value={i + 1}>
              {m.substring(0, 3)}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
          className="border-2 border-black bg-white p-2 font-mono text-sm focus:outline-none"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => onGenerate(month, year)}
        disabled={isGenerating}
        className="text-accent-gold font-display flex w-full items-center justify-center gap-2 border-2 border-black bg-black px-4 py-2 text-sm font-bold uppercase"
      >
        {isGenerating && <Loader2 size={16} className="animate-spin" />}
        Generate
      </button>
    </div>
  );
}

function ReportModal({
  report,
  onClose,
}: {
  report: MonthlyReport;
  onClose: () => void;
}) {
  const { report_json: data } = report;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
      onClick={onClose}
    >
      <div
        className="bg-bg-surface relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border-2 border-black p-8 shadow-[8px_8px_0px_#000]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="text-text-secondary hover:text-text-primary absolute top-4 right-4 transition-colors"
        >
          <X size={24} />
        </button>

        <header className="mb-8">
          <h2 className="font-display text-3xl font-black tracking-tighter uppercase">
            {MONTH_NAMES[report.month - 1]} {report.year} — Report
          </h2>
        </header>

        <div className="mb-8 grid grid-cols-2 gap-4">
          <StatMiniCard
            label="Total Income"
            value={formatNaira(data.totalIncome)}
            color="text-accent-green"
          />
          <StatMiniCard
            label="Total Expenses"
            value={formatNaira(data.totalExpenses)}
            color="text-accent-red"
          />
          <StatMiniCard
            label="Net Balance"
            value={formatNaira(data.netBalance)}
            color={
              data.netBalance >= 0 ? "text-accent-primary" : "text-accent-red"
            }
          />
          <StatMiniCard
            label="Savings Rate"
            value={`${data.savingsRate}%`}
            color="text-accent-gold"
          />
        </div>

        <p className="text-text-secondary mb-8 font-mono text-sm">
          {data.transactionCount} transactions recorded
        </p>

        <section>
          <h4 className="font-display text-text-secondary mb-4 font-bold uppercase">
            Top Spending Categories
          </h4>
          <div className="space-y-4">
            {data.topCategories.length === 0 ? (
              <p className="text-text-secondary font-mono text-xs opacity-60">
                No expense data available.
              </p>
            ) : (
              data.topCategories.map((cat, idx) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex justify-between font-mono text-xs uppercase">
                    <span>
                      {idx + 1}. {cat.category}
                    </span>
                    <span className="text-accent-primary">
                      {formatNaira(cat.total)}
                    </span>
                  </div>
                  <div className="bg-bg-elevated h-4 border border-black">
                    <div
                      className="bg-accent-gold h-full border-r border-black"
                      style={{ width: `${Math.min(100, cat.percentage)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <footer className="mt-8 border-t-2 border-black pt-6">
          <p className="text-text-secondary font-mono text-xs">
            This report was auto-generated. PDF export coming soon.
          </p>
        </footer>
      </div>
    </div>
  );
}

function StatMiniCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-bg-surface border-2 border-black p-3">
      <div className="text-text-secondary mb-1 font-mono text-[10px] uppercase">
        {label}
      </div>
      <div className={`font-mono text-lg font-bold tracking-tighter ${color}`}>
        {value}
      </div>
    </div>
  );
}
