import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/features/settings/ProfileForm";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  const sp = await searchParams;

  return (
    <ProfileForm
      profile={{
        id: session.user.id,
        email: session.user.email ?? "",
        displayName: profile?.display_name ?? "",
      }}
      success={sp.success === "true"}
      error={sp.error}
    />
  );
}
