import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import TopBar from "@/components/layout/TopBar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile for display name
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  const displayName =
    profile?.display_name || user.user_metadata?.display_name || "User";
  const email = user.email || "";

  return (
    <div className="bg-bg-base flex min-h-screen flex-col md:flex-row">
      <div className="hidden md:block">
        <Sidebar displayName={displayName} email={email} />
      </div>

      <main className="flex-1 pb-16 md:ml-60 md:pb-0">
        <div className="md:hidden">
          <TopBar />
        </div>
        <div className="mx-auto max-w-6xl p-4 md:p-8">{children}</div>
      </main>

      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
