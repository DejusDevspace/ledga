"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { MonthlyTotal } from "@/types";
import { formatNaira } from "@/lib/analytics/formatters";

interface Props {
  data: MonthlyTotal[];
}

export default function SpendingTrendChart({ data }: Props) {
  return (
    <div className="bg-bg-elevated border-divider h-64 w-full border p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#2A2A4A"
            horizontal={true}
            vertical={false}
          />
          <XAxis
            type="number"
            tick={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fill: "#A0A8B8",
            }}
            tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            dataKey="month"
            type="category"
            tick={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fill: "#A0A8B8",
            }}
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
          <Bar dataKey="expenses" fill="#4A90E2" radius={[0, 2, 2, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
