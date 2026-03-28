"use client";

import { useState } from "react";
import { PeriodValue } from "@/constants/periods";

export function usePeriod() {
  const [period, setPeriodState] = useState<PeriodValue>("this_month");
  const [customRange, setCustomRange] = useState<{
    from: string;
    to: string;
  } | null>(null);

  const setPeriod = (p: PeriodValue) => {
    setPeriodState(p);
    if (p !== "custom") {
      setCustomRange(null);
    }
  };

  return { period, setPeriod, customRange, setCustomRange };
}
