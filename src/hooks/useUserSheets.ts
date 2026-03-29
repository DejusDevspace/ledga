"use client";

import { useSheets } from "@/providers/SheetsProvider";

export function useUserSheets() {
  const {
    sheets,
    loading,
    error,
    refresh,
    addSheet,
    updateSheet,
    removeSheet
  } = useSheets();

  return {
    sheets,
    loading,
    error,
    refresh,
    addSheet,
    updateSheet,
    removeSheet,
  };
}
