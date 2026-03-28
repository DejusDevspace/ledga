const EXPECTED_HEADERS = ["DATE", "TYPE", "CATEGORY", "DESCRIPTION", "AMOUNT"];

export function validateSheetHeaders(firstRow: string[]): void {
  const normalised = firstRow.map((h) => h.trim().toUpperCase());

  for (const header of EXPECTED_HEADERS) {
    if (!normalised.includes(header)) {
      throw new Error(
        `Sheet is missing required column: "${header}". Expected columns: DATE, TYPE, CATEGORY, DESCRIPTION, AMOUNT`
      );
    }
  }
}
