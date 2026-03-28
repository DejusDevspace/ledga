import { Transaction, TransactionType } from "@/types";

const VALID_TYPES: TransactionType[] = ["income", "expense"];

export function parseSheetRows(rows: string[][]): Transaction[] {
  const transactions: Transaction[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowIndex = i;
    const sheetRow = rowIndex + 2; // data starts at sheet row 2

    const rawDate = row[0]?.trim();
    const rawType = row[1]?.trim().toLowerCase();
    const rawCategory = row[2]?.trim();
    const rawDescription = row[3]?.trim();
    const rawAmount = row[4]?.trim();

    // ── Validation ───────────────────────────────────────────
    if (!rawDate) {
      console.warn(`[Ledga] Skipping invalid row ${sheetRow}:`, "missing date");
      continue;
    }

    if (!VALID_TYPES.includes(rawType as TransactionType)) {
      console.warn(
        `[Ledga] Skipping invalid row ${sheetRow}:`,
        `unrecognised type "${rawType}"`
      );
      continue;
    }

    if (!rawCategory) {
      console.warn(
        `[Ledga] Skipping invalid row ${sheetRow}:`,
        "missing category"
      );
      continue;
    }

    if (!rawAmount) {
      console.warn(
        `[Ledga] Skipping invalid row ${sheetRow}:`,
        "missing amount"
      );
      continue;
    }

    // ── Date parsing (DD/MM/YYYY → YYYY-MM-DD) ──────────────
    const dateParts = rawDate.split("/");
    if (dateParts.length !== 3) {
      console.warn(
        `[Ledga] Skipping invalid row ${sheetRow}:`,
        `unparseable date "${rawDate}"`
      );
      continue;
    }

    const [day, month, year] = dateParts;
    const date = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
      console.warn(
        `[Ledga] Skipping invalid row ${sheetRow}:`,
        `invalid date "${rawDate}"`
      );
      continue;
    }

    // ── Amount parsing ───────────────────────────────────────
    const cleaned = rawAmount.replace(/,/g, "");
    const amount = parseFloat(cleaned);

    if (isNaN(amount) || amount <= 0) {
      console.warn(
        `[Ledga] Skipping invalid row ${sheetRow}:`,
        `non-numeric or non-positive amount "${rawAmount}"`
      );
      continue;
    }

    transactions.push({
      id: `row_${sheetRow}`,
      date,
      type: rawType as TransactionType,
      category: rawCategory,
      description: rawDescription ?? "",
      amount,
    });
  }

  return transactions;
}
