"use client";

import Link from "next/link";
import { ArrowRight, BarChart2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { formatNaira, formatDate } from "@/lib/analytics/formatters";
import type { Transaction } from "@/types/transaction";

interface Props {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: Props) {
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  if (transactions.length === 0) {
    return (
      <section className="bg-bg-surface border-2 border-black p-6 shadow-[4px_4px_0px_#000]">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display text-2xl font-black tracking-tighter uppercase">
            Recent Transactions
          </h3>
        </div>
        <div className="py-16 text-center">
          <BarChart2 size={48} className="text-text-secondary mx-auto" />
          <h4 className="font-display text-text-secondary mt-4 font-bold uppercase">
            No Transactions Found
          </h4>
          <p className="text-text-secondary mt-2 font-mono text-sm">
            Add transactions to your Google Sheet to get started
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-bg-surface border-2 border-black p-6 shadow-[4px_4px_0px_#000]">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-display text-2xl font-black tracking-tighter uppercase">
          Recent Transactions
        </h3>
        <Link
          href={ROUTES.TRANSACTIONS}
          className="text-accent-primary font-display flex items-center gap-1 text-sm font-bold uppercase hover:underline"
        >
          View All <ArrowRight size={16} />
        </Link>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-black text-left font-mono text-[11px] uppercase opacity-60">
              <th className="px-2 pb-3">Date</th>
              <th className="px-2 pb-3">Type</th>
              <th className="px-2 pb-3">Category</th>
              <th className="px-2 pb-3">Description</th>
              <th className="px-2 pb-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="font-body">
            {recent.map((tx, idx) => {
              const isIncome = tx.type === "income";
              return (
                <tr
                  key={idx}
                  className="border-divider/30 hover:bg-bg-surface group border-b transition-colors"
                >
                  <td className="px-2 py-4 font-mono text-sm">
                    {formatDate(tx.date)}
                  </td>
                  <td className="px-2 py-4">
                    <span
                      className={`font-display border border-black px-2 py-0.5 text-[9px] font-black text-black uppercase ${
                        isIncome ? "bg-accent-gold" : "bg-accent-red"
                      }`}
                    >
                      {tx.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-2 py-4 text-sm italic opacity-80">
                    {tx.category}
                  </td>
                  <td className="px-2 py-4 text-sm">{tx.description}</td>
                  <td
                    className={`px-2 py-4 text-right font-mono font-bold ${
                      isIncome ? "text-accent-green" : "text-accent-red"
                    }`}
                  >
                    {formatNaira(tx.amount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
