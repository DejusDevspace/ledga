"use client";

import { updateDisplayName } from "@/lib/supabase/actions";

interface Profile {
  id: string;
  email: string;
  displayName: string;
}

interface Props {
  profile: Profile;
  success: boolean;
  error?: string;
}

export default function ProfileForm({ profile, success, error }: Props) {
  const initials = profile.displayName
    ? profile.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "NA";

  return (
    <div className="bg-bg-surface border-2 border-black p-8 shadow-[8px_8px_0px_#000]">
      <div className="mb-8 flex items-center gap-4">
        <div className="bg-accent-gold font-display flex h-16 w-16 items-center justify-center border-2 border-black text-2xl font-black text-black">
          {initials}
        </div>
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tighter uppercase">
            Profile
          </h2>
          <p className="text-text-secondary font-mono text-sm">
            Personal account details
          </p>
        </div>
      </div>

      {success && (
        <div className="bg-accent-green/10 border-accent-green text-accent-green mb-6 border-2 p-4 font-mono text-sm">
          ✓ Changes saved successfully
        </div>
      )}

      {error && (
        <div className="bg-accent-red/10 border-accent-red text-accent-red mb-6 border-2 p-4 font-mono text-sm">
          Error: {error}
        </div>
      )}

      <form action={updateDisplayName} className="space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-text-secondary font-mono text-xs uppercase">
              Display Name
            </label>
            <input
              name="displayName"
              type="text"
              defaultValue={profile.displayName}
              className="bg-bg-elevated focus:border-accent-primary w-full border-2 border-black p-4 transition-all outline-none focus:shadow-[4px_4px_0px_#000]"
            />
          </div>

          <div className="space-y-2 opacity-70">
            <label className="text-text-secondary font-mono text-xs uppercase">
              Email (Immutable)
            </label>
            <input
              type="email"
              readOnly
              value={profile.email}
              className="bg-bg-surface text-text-secondary w-full cursor-not-allowed border-2 border-black p-4 italic"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-accent-primary font-display border-2 border-black px-8 py-4 font-black tracking-widest text-black uppercase shadow-[6px_6px_0px_#000] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] active:translate-y-1 active:shadow-none"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
