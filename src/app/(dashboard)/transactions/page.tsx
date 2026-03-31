import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TransactionsClient from "@/components/features/transactions/TransactionsClient";

export const metadata = {
  title: "Transactions | Ledga",
  description: "Track and manage your family's financial transactions.",
};

export default async function TransactionsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <TransactionsClient />;
}
