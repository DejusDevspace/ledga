"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import type { UserSheet } from "@/types/sheet";

const STORAGE_KEY = "ledga_active_sheet_id";

interface SheetsContextType {
  sheets: UserSheet[];
  activeSheet: UserSheet | null;
  loading: boolean;
  error: string | null;
  setActiveSheet: (sheet: UserSheet) => void;
  refresh: () => Promise<void>;
  addSheet: (sheet: UserSheet) => void;
  updateSheet: (sheet: UserSheet) => void;
  removeSheet: (id: string) => void;
}

const SheetsContext = createContext<SheetsContextType | undefined>(undefined);

export function SheetsProvider({ children }: { children: React.ReactNode }) {
  const { supabase, user, loading: authLoading } = useSupabase();
  const [sheets, setSheets] = useState<UserSheet[]>([]);
  const [activeSheetId, setActiveSheetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSheets = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("user_sheets")
        .select("*")
        .eq("user_id", user.id)
        .order("is_primary", { ascending: false })
        .order("created_at", { ascending: true });

      if (fetchError) throw fetchError;

      const mappedSheets: UserSheet[] = (data || []).map((s) => ({
        id: s.id,
        userId: s.user_id,
        sheetId: s.sheet_id,
        sheetLabel: s.sheet_label || s.title || "Untitled",
        formUrl: s.form_url || undefined,
        isPrimary: s.is_primary,
        createdAt: s.created_at,
      }));

      setSheets(mappedSheets);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load sheets";
      console.error("[SheetsProvider] Error fetching sheets:", err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [supabase, user]);

  useEffect(() => {
    if (!authLoading) {
      fetchSheets();
    }
  }, [authLoading, fetchSheets]);

  // Load active sheet ID from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setActiveSheetId(saved);
      }
    }
  }, []);

  const activeSheet = useMemo(() => {
    if (sheets.length === 0) return null;
    if (activeSheetId) {
      const found = sheets.find((s) => s.id === activeSheetId);
      if (found) return found;
    }
    return sheets.find((s) => s.isPrimary) ?? sheets[0];
  }, [sheets, activeSheetId]);

  const setActiveSheet = useCallback((sheet: UserSheet) => {
    setActiveSheetId(sheet.id);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, sheet.id);
    }
  }, []);

  const addSheet = useCallback((newSheet: UserSheet) => {
    setSheets((prev) => {
      if (newSheet.isPrimary) {
        return [newSheet, ...prev.map((s) => ({ ...s, isPrimary: false }))];
      }
      return [...prev, newSheet];
    });
  }, []);

  const updateSheet = useCallback((updatedSheet: UserSheet) => {
    setSheets((prev) => {
      let next = prev.map((s) => (s.id === updatedSheet.id ? updatedSheet : s));
      if (updatedSheet.isPrimary) {
        next = next.map((s) =>
          s.id === updatedSheet.id ? s : { ...s, isPrimary: false }
        );
      }
      return next.sort((a, b) => {
        if (a.isPrimary) return -1;
        if (b.isPrimary) return 1;
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
    });
  }, []);

  const removeSheet = useCallback((id: string) => {
    setSheets((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      sheets,
      activeSheet,
      loading: loading || authLoading,
      error,
      setActiveSheet,
      refresh: fetchSheets,
      addSheet,
      updateSheet,
      removeSheet,
    }),
    [
      sheets,
      activeSheet,
      loading,
      authLoading,
      error,
      setActiveSheet,
      fetchSheets,
      addSheet,
      updateSheet,
      removeSheet,
    ]
  );

  return (
    <SheetsContext.Provider value={value}>{children}</SheetsContext.Provider>
  );
}

export function useSheets() {
  const context = useContext(SheetsContext);
  if (context === undefined) {
    throw new Error("useSheets must be used within a SheetsProvider");
  }
  return context;
}
