import { Transaction } from "@/types";

const CACHE_DURATION_MS = 300_000; // 5 minutes

interface CacheEntry {
  data: Transaction[];
  fetchedAt: number;
}

const cache = new Map<string, CacheEntry>();

export function getCached(sheetId: string): Transaction[] | null {
  const entry = cache.get(sheetId);
  if (!entry) return null;

  if (Date.now() - entry.fetchedAt > CACHE_DURATION_MS) {
    cache.delete(sheetId);
    return null;
  }

  return entry.data;
}

export function setCached(sheetId: string, data: Transaction[]): void {
  cache.set(sheetId, { data, fetchedAt: Date.now() });
}

export function invalidateCache(sheetId: string): void {
  cache.delete(sheetId);
}

export function getCacheAge(sheetId: string): number | null {
  const entry = cache.get(sheetId);
  if (!entry) return null;
  return Math.round((Date.now() - entry.fetchedAt) / 1000);
}
