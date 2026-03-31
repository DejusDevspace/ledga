import { SupabaseClient } from "@supabase/supabase-js";
import { UserSheet, MonthlyReport } from "@/types";

// ─── Profile ────────────────────────────────────────────

export async function getProfile(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

// ─── User Sheets ────────────────────────────────────────

export async function getUserSheets(
  supabase: SupabaseClient
): Promise<UserSheet[]> {
  const { data, error } = await supabase
    .from("user_sheets")
    .select("*")
    .order("is_primary", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapSheetRow);
}

export async function insertUserSheet(
  supabase: SupabaseClient,
  sheet: Omit<UserSheet, "id" | "createdAt">
) {
  const { data, error } = await supabase
    .from("user_sheets")
    .insert({
      user_id: sheet.userId,
      sheet_id: sheet.sheetId,
      sheet_label: sheet.sheetLabel,
      form_url: sheet.formUrl,
      is_primary: sheet.isPrimary,
    })
    .select()
    .single();

  if (error) throw error;

  // Sync with profile if it's the primary sheet
  if (sheet.isPrimary) {
    const userId = sheet.userId;

    // 1. Unset all other sheets for this user as primary
    await supabase
      .from("user_sheets")
      .update({ is_primary: false })
      .eq("user_id", userId)
      .neq("id", data.id);

    // 2. Update the profile with the new primary Google Sheet ID
    await supabase
      .from("profiles")
      .update({ primary_sheet_id: sheet.sheetId })
      .eq("id", userId);
  }

  return mapSheetRow(data);
}

export async function updateUserSheet(
  supabase: SupabaseClient,
  id: string,
  updates: Partial<UserSheet>
) {
  const mapped: Record<string, unknown> = {};
  if (updates.sheetId !== undefined) mapped.sheet_id = updates.sheetId;
  if (updates.sheetLabel !== undefined)
    mapped.sheet_label = updates.sheetLabel;
  if (updates.formUrl !== undefined) mapped.form_url = updates.formUrl;
  if (updates.isPrimary !== undefined) mapped.is_primary = updates.isPrimary;

  const { data, error } = await supabase
    .from("user_sheets")
    .update(mapped)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  // Handle primary synchronization
  if (updates.isPrimary === true) {
    const userId = data.user_id;

    // 1. Unset all other sheets for this user as primary
    await supabase
      .from("user_sheets")
      .update({ is_primary: false })
      .eq("user_id", userId)
      .neq("id", id);

    // 2. Update the profile with the new primary Google Sheet ID
    await supabase
      .from("profiles")
      .update({ primary_sheet_id: data.sheet_id })
      .eq("id", userId);
  }

  return mapSheetRow(data);
}

export async function deleteUserSheet(
  supabase: SupabaseClient,
  id: string
) {
  // Fetch sheet before deleting to check if it's the primary
  const { data: sheet } = await supabase
    .from("user_sheets")
    .select("user_id, sheet_id, is_primary")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("user_sheets")
    .delete()
    .eq("id", id);

  if (error) throw error;

  // If we just deleted the primary sheet, clear it from the profile
  if (sheet?.is_primary) {
    await supabase
      .from("profiles")
      .update({ primary_sheet_id: null })
      .eq("id", sheet.user_id);
  }
}

// ─── Reports ────────────────────────────────────────────

export async function getUserReports(
  supabase: SupabaseClient
): Promise<MonthlyReport[]> {
  const { data, error } = await supabase
    .from("monthly_reports")
    .select("*")
    .order("year", { ascending: false })
    .order("month", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapReportRow);
}

// ─── Row mappers (snake_case → camelCase) ───────────────

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapSheetRow(row: any): UserSheet {
  return {
    id: row.id,
    userId: row.user_id,
    sheetId: row.sheet_id,
    sheetLabel: row.sheet_label,
    formUrl: row.form_url,
    isPrimary: row.is_primary,
    createdAt: row.created_at,
  };
}

function mapReportRow(row: any): MonthlyReport {
  return {
    id: row.id,
    user_id: row.user_id,
    month: row.month,
    year: row.year,
    report_json: row.report_json,
    pdf_url: row.pdf_url,
    email_sent: row.email_sent,
    created_at: row.created_at,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */
