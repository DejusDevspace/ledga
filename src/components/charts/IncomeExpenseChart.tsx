"use client";

import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { formatNaira } from "@/lib/analytics/formatters";
import type { MonthlyTotal } from "@/types/analytics";

interface Props {
  data: MonthlyTotal[];
}

export default function IncomeExpenseChart({ data }: Props) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasMounted(true);
  }, []);

  return (
    <div className="bg-bg-surface flex flex-col border-2 border-black p-6 shadow-[4px_4px_0px_#000] lg:col-span-6">
      <div className="mb-8 flex items-center justify-between">
        <h3 className="font-display text-xl font-black tracking-tighter uppercase italic">
          Income vs Expenses
        </h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-accent-green h-3 w-3 border border-black"></div>
            <span className="font-mono text-[10px] uppercase">Inflow</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-accent-red h-3 w-3 border border-black"></div>
            <span className="font-mono text-[10px] uppercase">Outflow</span>
          </div>
        </div>
      </div>
      <div className="h-80 flex-1">
        {!hasMounted ? (
          <div className="skeleton h-full w-full" />
        ) : (
          <ResponsiveContainer
            width="100%"
            height={320}
            debounce={100}
          >
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-divider)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  fill: "#A0A8B8",
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  fill: "#A0A8B8",
                }}
                tickFormatter={(value) => formatNaira(value)}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F3460",
                  border: "1px solid #4A90E2",
                  borderRadius: 0,
                }}
                labelStyle={{ color: "#F0F0F0" }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => formatNaira(Number(value))}
              />
              <Bar
                dataKey="income"
                fill="var(--color-accent-green)"
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="expenses"
                fill="var(--color-accent-red)"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
