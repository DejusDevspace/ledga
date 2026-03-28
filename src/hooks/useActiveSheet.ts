"use client";

import { useState, useMemo, useEffect } from "react";
import { UserSheet } from "@/types";

const STORAGE_KEY = "ledga_active_sheet_id";

export function useActiveSheet(sheets: UserSheet[]) {
  const [selectedSheetId, setSelectedSheetId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedSheetId(saved);
      }
    }
  }, []);

  const activeSheet = useMemo(() => {
    if (sheets.length === 0) return null;
    if (selectedSheetId) {
      const found = sheets.find((s) => s.id === selectedSheetId);
      if (found) return found;
    }
    return sheets.find((s) => s.isPrimary) ?? sheets[0];
  }, [sheets, selectedSheetId]);

  const setActiveSheet = (sheet: UserSheet) => {
    setSelectedSheetId(sheet.id);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, sheet.id);
    }
  };

  return { activeSheet, setActiveSheet };
}
