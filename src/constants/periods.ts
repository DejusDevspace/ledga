export const PERIOD_OPTIONS = [
  { label: "This Month", value: "this_month" },
  { label: "Last 3 Months", value: "last_3_months" },
  { label: "This Year", value: "this_year" },
  { label: "Custom", value: "custom" },
] as const;

export type PeriodValue =
  typeof PERIOD_OPTIONS[number]["value"];
