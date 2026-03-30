"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { MonthlyReport } from "@/types/reports";

/**
 * Hook to manage monthly reports on the client.
 * Handles fetching, refreshing, and local state management.
 */
export function useReports(initialReports: MonthlyReport[]) {
  const [reports, setReports] = useState<MonthlyReport[]>(initialReports);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("monthly_reports")
        .select("*")
        .order("year", { ascending: false })
        .order("month", { ascending: false });

      if (fetchError) throw fetchError;
      setReports(data || []);
    } catch (err) {
      console.error("[Ledga] Failed to refresh reports:", err);
      setError("Failed to refresh reports list");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    reports,
    loading,
    error,
    refreshReports,
  };
}
