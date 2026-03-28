import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SheetsManager from "@/components/features/settings/SheetsManager";
import type { UserSheet } from "@/types";

export default async function SheetsPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const { data } = await supabase
    .from("user_sheets")
    .select("*")
    .eq("user_id", session.user.id)
    .order("is_primary", { ascending: false });

  const initialSheets: UserSheet[] = (data || []).map((s) => ({
    id: s.id,
    userId: s.user_id,
    sheetId: s.sheet_id,
    sheetLabel: s.sheet_label || s.title || "Untitled",
    formUrl: s.form_url || undefined,
    isPrimary: s.is_primary,
    createdAt: s.created_at,
  }));

  return <SheetsManager initialSheets={initialSheets} />;
}
