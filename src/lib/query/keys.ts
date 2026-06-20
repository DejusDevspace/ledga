export const queryKeys = {
  userSheets: (userId?: string) => ["userSheets", userId] as const,
  transactions: (sheetId?: string | null) => ["transactions", sheetId] as const,
  reports: (userId?: string) => ["reports", userId] as const,
};
