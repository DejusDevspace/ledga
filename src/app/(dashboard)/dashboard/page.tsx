import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "@/components/features/dashboard/DashboardClient";
import type { UserSheet } from "@/types/sheet";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  // Fetch user_sheets
  const { data: sheetsData } = await supabase
    .from("user_sheets")
    .select("*")
    .eq("user_id", session.user.id)
    .order("is_primary", { ascending: false })
    .order("created_at", { ascending: true });

  // Map to UserSheet type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sheets: UserSheet[] = (sheetsData || []).map((s: any) => ({
    id: s.id,
    userId: s.user_id,
    sheetId: s.sheet_id,
    sheetLabel: s.sheet_label || s.title || "Untitled",
    formUrl: s.form_url || undefined,
    isPrimary: s.is_primary,
    createdAt: s.created_at,
  }));

  return <DashboardClient profile={profile} sheets={sheets} />;
}
