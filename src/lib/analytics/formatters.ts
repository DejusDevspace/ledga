/**
 * Format a number as Nigerian Naira currency
 * e.g. 257150 → "₦257,150"
 */
export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("NGN", "₦")
    .trim();
}

/**
 * Format a number as a percentage string
 * e.g. 48.1 → "48.1%"
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Format an ISO date string to display format
 * e.g. "2025-01-15" → "15 Jan 2025"
 */
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
