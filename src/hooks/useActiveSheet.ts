"use client";

import { useSheets } from "@/providers/SheetsProvider";

export function useActiveSheet() {
  const { activeSheet, setActiveSheet } = useSheets();
  return { activeSheet, setActiveSheet };
}
