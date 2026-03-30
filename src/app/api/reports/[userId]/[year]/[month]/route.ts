import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{
    userId: string;
    year: string;
    month: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  const { userId, year, month } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorised" },
      { status: 401 }
    );
  }

  // Ownership check — users can only fetch their own reports
  if (user.id !== userId) {
    return NextResponse.json(
      { error: "Access denied" },
      { status: 403 }
    );
  }

  const { data, error } = await supabase
    .from("monthly_reports")
    .select("*")
    .eq("user_id", userId)
    .eq("year", parseInt(year))
    .eq("month", parseInt(month))
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Report not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ report: data });
}
