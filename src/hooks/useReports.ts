"use client";

import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "@/providers/SupabaseProvider";
import { MonthlyReport } from "@/types/reports";
import { getUserReports } from "@/lib/supabase/queries";
import { queryKeys } from "@/lib/query/keys";

/**
 * Hook to manage monthly reports on the client.
 * Handles fetching, refreshing, and local state management.
 */
export function useReports(initialReports: MonthlyReport[]) {
  const { supabase, user } = useSupabase();
  const userId = user?.id;
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.reports(userId),
    queryFn: () => getUserReports(supabase),
    enabled: Boolean(userId),
    initialData: initialReports,
  });

  const refreshReports = useCallback(async () => {
    try {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.reports(userId),
      });
    } catch (err) {
      console.error("[Ledga] Failed to refresh reports:", err);
    }
  }, [queryClient, userId]);

  return {
    reports: query.data ?? [],
    loading: query.isPending,
    error: query.error ? "Failed to refresh reports list" : null,
    refreshReports,
  };
}
