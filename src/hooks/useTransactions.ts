"use client";

import { useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Transaction } from "@/types";
import { queryKeys } from "@/lib/query/keys";

const EMPTY_TRANSACTIONS: Transaction[] = [];

interface UseTransactionsReturn {
  transactions: Transaction[];
  categories: string[];
  loading: boolean;
  error: string | null;
  fromCache: boolean;
  refresh: () => void;
}

export function useTransactions(sheetId: string | null): UseTransactionsReturn {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.transactions(sheetId),
    queryFn: async () => {
      if (!sheetId) {
        return { transactions: [] as Transaction[], fromCache: false };
      }

      const res = await fetch(`/api/sheets/${sheetId}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? "Failed to load transactions");
      }

      return {
        transactions: json.transactions as Transaction[],
        fromCache: Boolean(json.fromCache),
      };
    },
    enabled: Boolean(sheetId),
    placeholderData: (previousData) => previousData,
  });

  const transactions = query.data?.transactions ?? EMPTY_TRANSACTIONS;

  // Derive unique categories from transactions
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const t of transactions) {
      if (t.category) set.add(t.category);
    }
    return Array.from(set).sort();
  }, [transactions]);

  const refresh = useCallback(() => {
    if (!sheetId) return;

    queryClient.fetchQuery({
      queryKey: queryKeys.transactions(sheetId),
      queryFn: async () => {
        const res = await fetch(`/api/sheets/${sheetId}?refresh=true`);
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error ?? "Failed to load transactions");
        }

        return {
          transactions: json.transactions as Transaction[],
          fromCache: Boolean(json.fromCache),
        };
      },
    });
  }, [queryClient, sheetId]);

  return {
    transactions,
    categories,
    loading: query.isPending && Boolean(sheetId),
    error: query.error instanceof Error ? query.error.message : null,
    fromCache: query.data?.fromCache ?? false,
    refresh,
  };
}
