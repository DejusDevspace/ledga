/**
 * GET /api/sheets/[sheetId]
 *
 * Fetches and parses transaction data from a Google Sheet.
 *
 * Query params:
 *   - refresh (optional): if "true", bypass cache and re-fetch
 *
 * Success response:
 *   { transactions: Transaction[], fromCache: boolean }
 *
 * Error responses:
 *   401 { error: "Unauthorised" }
 *   403 { error: "Sheet not found or access denied" }
 *   500 { error: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchSheetRows } from "@/lib/sheets/client";
import { parseSheetRows } from "@/lib/sheets/parser";
import { getCached, setCached, invalidateCache } from "@/lib/sheets/cache";

interface RouteParams {
  params: Promise<{ sheetId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { sheetId } = await params;
  const shouldRefresh =
    request.nextUrl.searchParams.get("refresh") === "true";

  // ── 1. Auth check ──────────────────────────────────────────
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  // ── 2. Ownership check ─────────────────────────────────────
  const { data: sheet } = await supabase
    .from("user_sheets")
    .select("id")
    .eq("sheet_id", sheetId)
    .eq("user_id", user.id)
    .single();

  if (!sheet) {
    return NextResponse.json(
      { error: "Sheet not found or access denied" },
      { status: 403 }
    );
  }

  // ── 3. Cache check ─────────────────────────────────────────
  if (!shouldRefresh) {
    const cached = getCached(sheetId);
    if (cached) {
      return NextResponse.json({ transactions: cached, fromCache: true });
    }
  } else {
    invalidateCache(sheetId);
  }

  // ── 4. Fetch from Google Sheets API ────────────────────────
  try {
    const rows = await fetchSheetRows(sheetId);
    const transactions = parseSheetRows(rows);
    setCached(sheetId, transactions);

    return NextResponse.json({ transactions, fromCache: false });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error fetching sheet data";

    console.error(`[Ledga] Sheet fetch failed for ${sheetId}:`, message);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
