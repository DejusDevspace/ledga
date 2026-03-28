"use client";

import { useState, useMemo } from "react";
import { UserSheet } from "@/types";

const STORAGE_KEY = "ledga_active_sheet_id";

function resolveInitialSheet(sheets: UserSheet[]): UserSheet | null {
  if (sheets.length === 0) return null;

  if (typeof window !== "undefined") {
    const savedId = localStorage.getItem(STORAGE_KEY);
    const saved = savedId ? sheets.find((s) => s.id === savedId) : null;
    if (saved) return saved;
  }

  return sheets.find((s) => s.isPrimary) ?? sheets[0];
}

export function useActiveSheet(sheets: UserSheet[]) {
  const initialSheet = useMemo(() => resolveInitialSheet(sheets), [sheets]);
  const [activeSheet, setActiveSheetState] = useState<UserSheet | null>(initialSheet);

  const setActiveSheet = (sheet: UserSheet) => {
    setActiveSheetState(sheet);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, sheet.id);
    }
  };

  return { activeSheet, setActiveSheet };
}
