"use client";

import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { formatPercent } from "@/lib/analytics/formatters";

interface SavingsRateData {
  month: string;
  savingsRate: number;
}

interface Props {
  data: SavingsRateData[];
}

export default function SavingsRateChart({ data }: Props) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasMounted(true);
  }, []);

  const latestSavingsRate =
    data.length > 0 ? data[data.length - 1].savingsRate : 0;

  return (
    <div className="relative h-64 w-full overflow-hidden">
      {!hasMounted ? (
        <div className="skeleton h-full w-full" />
      ) : (
        <ResponsiveContainer width="100%" height={256} debounce={100}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
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
              dy={5}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
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
                border: "1px solid #E2C94A",
                borderRadius: 0,
              }}
              labelStyle={{ color: "#F0F0F0" }}
              itemStyle={{ color: "#E2C94A" }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(v: any) => `${Number(v).toFixed(1)}%`}
            />
            <Area
              type="monotone"
              dataKey="savingsRate"
              stroke="#E2C94A"
              strokeWidth={4}
              fill="#E2C94A"
              fillOpacity={0.15}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
      <div className="text-accent-gold absolute bottom-6 left-12 z-10 font-mono text-3xl font-bold">
        {formatPercent(latestSavingsRate)}
      </div>
    </div>
  );
}
