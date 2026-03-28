"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import type { MonthlyTotal } from "@/types";
import { formatNaira } from "@/lib/analytics/formatters";

interface Props {
  data: MonthlyTotal[];
}

export default function IncomeStabilityChart({ data }: Props) {
  const avgIncome =
    data.length > 0
      ? data.reduce((sum, d) => sum + d.income, 0) / data.length
      : 0;

  return (
    <div className="bg-bg-elevated border-divider relative h-64 w-full border p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#2A2A4A"
            horizontal={true}
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
            tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
            tick={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fill: "#A0A8B8",
            }}
            axisLine={false}
            tickLine={false}
            width={50}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0F3460",
              border: "1px solid #4AE290",
              borderRadius: 0,
            }}
            labelStyle={{ color: "#F0F0F0" }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => formatNaira(Number(value))}
          />
          <ReferenceLine
            y={avgIncome}
            stroke="#E24A4A"
            strokeDasharray="8 4"
            strokeWidth={2}
            label={{
              value: "avg",
              fill: "#E24A4A",
              fontSize: 10,
              fontFamily: "JetBrains Mono",
              position: "insideTopLeft",
            }}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#4AE290"
            strokeWidth={4}
            dot={{ fill: "#000", stroke: "#4AE290", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "#4AE290" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
