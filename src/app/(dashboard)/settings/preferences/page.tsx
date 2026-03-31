import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function PreferencesSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-text-primary text-2xl font-bold tracking-tighter uppercase">
          Preferences
        </h1>
      </header>
      <div className="bg-bg-surface border-2 border-black p-6 shadow-[4px_4px_0px_#000]">
        <p className="text-text-secondary font-mono text-sm uppercase">
          Preferences form shell...
        </p>
      </div>
    </div>
  );
}
