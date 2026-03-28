"use client";

import { useState, useEffect, useCallback } from "react";
import { Transaction } from "@/types";

interface UseTransactionsReturn {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  fromCache: boolean;
  refresh: () => void;
}

export function useTransactions(
  sheetId: string | null
): UseTransactionsReturn {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const fetchData = useCallback(
    async (refresh = false) => {
      if (!sheetId) return;

      setLoading(true);
      setError(null);

      try {
        const url = refresh
          ? `/api/sheets/${sheetId}?refresh=true`
          : `/api/sheets/${sheetId}`;

        const res = await fetch(url);
        const json = await res.json();

        if (!res.ok) {
          setError(json.error ?? "Failed to load transactions");
          return;
        }

        setTransactions(json.transactions);
        setFromCache(json.fromCache);
      } catch {
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    },
    [sheetId]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  return { transactions, loading, error, fromCache, refresh };
}
