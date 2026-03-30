import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ReportsClient from "@/components/features/reports/ReportsClient";
import { MonthlyReport } from "@/types/reports";

export const metadata = {
  title: "Monthly Reports | Ledga",
  description: "View and generate your monthly financial reports.",
};

export default async function ReportsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch initial reports for the current user
  const { data: reports, error } = await supabase
    .from("monthly_reports")
    .select("*")
    .eq("user_id", user.id)
    .order("year", { ascending: false })
    .order("month", { ascending: false });

  if (error) {
    console.error("[Ledga] Failed to fetch initial reports:", error);
  }

  return (
    <ReportsClient
      initialReports={(reports || []) as MonthlyReport[]}
    />
  );
}
