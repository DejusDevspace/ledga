import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SheetsManager from "@/components/features/settings/SheetsManager";

export default async function SheetsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return <SheetsManager />;
}
