import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import InsightsClient from "@/components/features/insights/InsightsClient";

export const metadata = {
  title: "Insights | Ledga",
  description: "Detailed financial analytics and spending trends.",
};

export default async function InsightsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <InsightsClient />;
}
