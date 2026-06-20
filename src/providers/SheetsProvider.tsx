"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "@/providers/SupabaseProvider";
import { getUserSheets } from "@/lib/supabase/queries";
import { queryKeys } from "@/lib/query/keys";
import type { UserSheet } from "@/types/sheet";

const STORAGE_KEY = "ledga_active_sheet_id";
const EMPTY_SHEETS: UserSheet[] = [];

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

export function SheetsProvider({
  children,
  initialSheets = [],
}: {
  children: React.ReactNode;
  initialSheets?: UserSheet[];
}) {
  const { supabase, user, loading: authLoading } = useSupabase();
  const userId = user?.id;
  const queryClient = useQueryClient();
  const [activeSheetId, setActiveSheetId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEY);
  });

  const sheetsQuery = useQuery({
    queryKey: queryKeys.userSheets(userId),
    queryFn: () => getUserSheets(supabase),
    enabled: !authLoading && Boolean(userId),
    initialData: initialSheets,
  });

  const sheets = sheetsQuery.data ?? EMPTY_SHEETS;

  const refreshSheets = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: queryKeys.userSheets(userId),
    });
  }, [queryClient, userId]);

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

  const addSheet = useCallback(
    (newSheet: UserSheet) => {
      queryClient.setQueryData<UserSheet[]>(
        queryKeys.userSheets(userId),
        (prev = []) => {
          if (newSheet.isPrimary) {
            return sortSheets([
              newSheet,
              ...prev.map((s) => ({ ...s, isPrimary: false })),
            ]);
          }
          return sortSheets([...prev, newSheet]);
        }
      );
    },
    [queryClient, userId]
  );

  const updateSheet = useCallback(
    (updatedSheet: UserSheet) => {
      queryClient.setQueryData<UserSheet[]>(
        queryKeys.userSheets(userId),
        (prev = []) => {
          let next = prev.map((s) =>
            s.id === updatedSheet.id ? updatedSheet : s
          );
          if (updatedSheet.isPrimary) {
            next = next.map((s) =>
              s.id === updatedSheet.id ? s : { ...s, isPrimary: false }
            );
          }
          return sortSheets(next);
        }
      );
    },
    [queryClient, userId]
  );

  const removeSheet = useCallback(
    (id: string) => {
      queryClient.setQueryData<UserSheet[]>(
        queryKeys.userSheets(userId),
        (prev = []) => prev.filter((s) => s.id !== id)
      );
    },
    [queryClient, userId]
  );

  const value = useMemo(
    () => ({
      sheets,
      activeSheet,
      loading: authLoading || (Boolean(userId) && sheetsQuery.isPending),
      error:
        sheetsQuery.error instanceof Error ? sheetsQuery.error.message : null,
      setActiveSheet,
      refresh: refreshSheets,
      addSheet,
      updateSheet,
      removeSheet,
    }),
    [
      sheets,
      activeSheet,
      authLoading,
      userId,
      sheetsQuery.isPending,
      sheetsQuery.error,
      setActiveSheet,
      refreshSheets,
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

function sortSheets(sheets: UserSheet[]) {
  return [...sheets].sort((a, b) => {
    if (a.isPrimary) return -1;
    if (b.isPrimary) return 1;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}
