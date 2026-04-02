"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/constants/routes";

export async function signUpWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const displayName = formData.get("displayName") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (error) {
    if (error.message.includes("Database error saving new user")) {
      redirect(
        `${ROUTES.SIGNUP}?error=${encodeURIComponent(
          "This email is not on the approved list. Contact your family admin."
        )}`
      );
    }
    redirect(`${ROUTES.SIGNUP}?error=${encodeURIComponent(error.message)}`);
  }

  redirect(ROUTES.DASHBOARD);
}

export async function signInWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`${ROUTES.LOGIN}?error=${encodeURIComponent(error.message)}`);
  }

  redirect(ROUTES.DASHBOARD);
}

export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo:
        process.env.NEXT_PUBLIC_APP_URL + "/api/auth/callback",
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    redirect(`${ROUTES.LOGIN}?error=${encodeURIComponent(error.message)}`);
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(ROUTES.LOGIN);
}

export async function updateDisplayName(formData: FormData) {
  const displayName = formData.get("displayName") as string;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName })
    .eq("id", user.id);

  if (error) {
    redirect(
      `${ROUTES.SETTINGS.PROFILE}?error=${encodeURIComponent(error.message)}`
    );
  }

  redirect(`${ROUTES.SETTINGS.PROFILE}?success=true`);
}
