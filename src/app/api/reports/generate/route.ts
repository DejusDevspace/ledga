import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { fetchSheetRows } from "@/lib/sheets/client";
import { parseSheetRows } from "@/lib/sheets/parser";
import { filterByDateRange } from "@/lib/analytics/filters";
import { buildReportSnapshot } from "@/lib/reports/generator";

// Vercel sends this header on cron invocations
const CRON_SECRET = process.env.CRON_SECRET;

export async function POST(request: NextRequest) {
  // ── Auth check ────────────────────────────────────────────
  // Accept either:
  // A) Vercel Cron request (Authorization: Bearer <CRON_SECRET>)
  // B) Authenticated user session (manual trigger)

  const authHeader = request.headers.get("authorization");
  const isCronRequest =
    CRON_SECRET && authHeader === `Bearer ${CRON_SECRET}`;

  console.log("Cron Secret", CRON_SECRET)
  console.log("Auth Header", authHeader)
  console.log("Cron Request?", isCronRequest)

  let userId: string | null = null;
  let isManualTrigger = false;

  if (isCronRequest) {
    // Cron path — will generate for ALL users
    userId = null;
  } else {
    // Check for authenticated user session
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    userId = user.id;
    isManualTrigger = true;
  }

  // ── Service role client ───────────────────────────────────
  // Use service role to bypass RLS for report writes
  const serviceClient = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // ── Determine target month/year ───────────────────────────
  let targetMonth: number;
  let targetYear: number;

  try {
    const body = await request.json().catch(() => ({}));
    const now = new Date();

    if (body.month && body.year) {
      targetMonth = parseInt(body.month);
      targetYear = parseInt(body.year);
    } else {
      // Default: previous month
      const prev = new Date(now.getFullYear(), now.getMonth() - 1);
      targetMonth = prev.getMonth() + 1; // 1-indexed
      targetYear = prev.getFullYear();
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // ── Build date range for target month ─────────────────────
  const dateFrom = `${targetYear}-${String(targetMonth).padStart(2, "0")}-01`;
  const lastDay = new Date(targetYear, targetMonth, 0).getDate();
  const dateTo = `${targetYear}-${String(targetMonth).padStart(2, "0")}-${String(
    lastDay
  ).padStart(2, "0")}`;

  // ── Fetch target users ────────────────────────────────────
  let usersToProcess: Array<{ userId: string; sheetId: string }> = [];

  if (isManualTrigger && userId) {
    // 1. Check Profile first (Standard source of truth)
    const { data: profile } = await serviceClient
      .from("profiles")
      .select("primary_sheet_id")
      .eq("id", userId)
      .single();

    if (profile?.primary_sheet_id) {
      usersToProcess = [{ userId, sheetId: profile.primary_sheet_id }];
    } else {
      // 2. Fallback: Search user_sheets for is_primary OR anything available
      const { data: sheets } = await serviceClient
        .from("user_sheets")
        .select("sheet_id, is_primary")
        .eq("user_id", userId)
        .order("is_primary", { ascending: false })
        .order("created_at", { ascending: true });

      if (sheets && sheets.length > 0) {
        usersToProcess = [{ userId, sheetId: sheets[0].sheet_id }];

        // Auto-heal profiles table: Promote this to primary officially
        await serviceClient
          .from("profiles")
          .update({ primary_sheet_id: sheets[0].sheet_id })
          .eq("id", userId);
      } else {
        return NextResponse.json(
          { error: "No primary sheet linked to your account. Add one in Settings." },
          { status: 400 }
        );
      }
    }
  } else {
    // Cron path for all users
    // Select users who have a primary sheet ID in profile
    const { data: profiles } = await serviceClient
      .from("profiles")
      .select("id, primary_sheet_id")
      .not("primary_sheet_id", "is", null);

    const profileUsers = (profiles ?? []).map((p) => ({
      userId: p.id,
      sheetId: p.primary_sheet_id as string,
    }));

    // Find users who have sheets but NO primary ID in profile yet
    const { data: fallbackSheets } = await serviceClient
      .from("user_sheets")
      .select("user_id, sheet_id")
      .not("user_id", "in", `(${profileUsers.map((u) => u.userId).join(",") || "''"})`)
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: true });

    // Deduplicate: Pick the first sheet per user
    const userFallbackMap = new Map<string, string>();
    for (const s of fallbackSheets ?? []) {
      if (!userFallbackMap.has(s.user_id)) {
        userFallbackMap.set(s.user_id, s.sheet_id);
      }
    }

    const fallbackUsers = Array.from(userFallbackMap.entries()).map(([u, s]) => ({
      userId: u,
      sheetId: s,
    }));

    usersToProcess = [...profileUsers, ...fallbackUsers];
  }

  // ── Generate report for each user ─────────────────────────
  const results: Array<{
    userId: string;
    status: "success" | "skipped" | "error";
    reason?: string;
  }> = [];

  for (const { userId: uid, sheetId } of usersToProcess) {
    // Check if report already exists for this month/year
    const { data: existing } = await serviceClient
      .from("monthly_reports")
      .select("id")
      .eq("user_id", uid)
      .eq("month", targetMonth)
      .eq("year", targetYear)
      .maybeSingle();

    if (existing && !isManualTrigger) {
      results.push({
        userId: uid,
        status: "skipped",
        reason: "Report already exists",
      });
      continue;
    }

    try {
      const rows = await fetchSheetRows(sheetId);
      const allTransactions = parseSheetRows(rows);
      const monthTransactions = filterByDateRange(
        allTransactions,
        dateFrom,
        dateTo
      );

      const snapshot = buildReportSnapshot(monthTransactions);

      const { error: upsertError } = await serviceClient
        .from("monthly_reports")
        .upsert(
          {
            user_id: uid,
            month: targetMonth,
            year: targetYear,
            report_json: snapshot,
            email_sent: false,
          },
          { onConflict: "user_id,month,year" }
        );

      if (upsertError) throw new Error(upsertError.message);
      results.push({ userId: uid, status: "success" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error(`[Ledga] Report failed for ${uid}:`, message);
      results.push({ userId: uid, status: "error", reason: message });
    }
  }

  return NextResponse.json({
    message: "Report generation complete",
    month: targetMonth,
    year: targetYear,
    results: {
      success: results.filter((r) => r.status === "success").length,
      skipped: results.filter((r) => r.status === "skipped").length,
      errors: results.filter((r) => r.status === "error").length,
    },
    details: results,
  });
}
