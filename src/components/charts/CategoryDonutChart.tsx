"use client";

import { useState, useEffect } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import type { CategoryTotal } from "@/types/analytics";
import { formatNaira } from "@/lib/analytics/formatters";

interface Props {
  data: CategoryTotal[];
  totalExpenses: number;
}

const COLORS = [
  "#E2C94A", // accent-gold
  "#4A90E2", // accent-primary
  "#E24A4A", // accent-red
  "#4AE290", // accent-green
  "#A0A8B8", // text-secondary
  "#0F3460", // bg-elevated
];

export default function CategoryDonutChart({ data, totalExpenses }: Props) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasMounted(true);
  }, []);

  return (
    <div className="bg-bg-surface flex flex-col border-2 border-black p-6 shadow-[4px_4px_0px_#000] lg:col-span-4">
      <h3 className="font-display mb-8 text-center text-xl font-black tracking-tighter uppercase italic">
        Spending by Category
      </h3>

      <div className="relative flex flex-1 items-center justify-center py-6">
        <div className="absolute mt-3 flex flex-col items-center justify-center text-center">
          <div className="font-mono text-2xl font-bold">
            {formatNaira(totalExpenses)}
          </div>
          <div className="text-text-secondary font-mono text-[10px]">TOTAL</div>
        </div>

        {!hasMounted ? (
          <div className="skeleton h-[200px] w-[200px] rounded-full" />
        ) : (
          <ResponsiveContainer
            width="100%"
            height={200}
            debounce={100}
          >
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="total"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {data.map((item, index) => {
          const percentage =
            totalExpenses > 0 ? (item.total / totalExpenses) * 100 : 0;
          return (
            <div
              key={item.category}
              className="bg-bg-surface border-divider flex items-center gap-2 border p-2"
            >
              <div
                className="h-2 w-2"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="font-mono text-[10px] uppercase">
                {item.category} ({percentage.toFixed(0)}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
