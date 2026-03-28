import Link from "next/link";
import { signUpWithEmail } from "@/lib/supabase/actions";
import { ROUTES } from "@/constants/routes";
import {
  AlertCircle,
  User,
  AtSign,
  Lock,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="bg-bg-base relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
      {/* Background dot-grid */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: "radial-gradient(#333348 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Subtle glow accents */}
      <div className="bg-accent-primary pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full opacity-5 blur-[120px]" />
      <div className="bg-accent-gold pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full opacity-5 blur-[120px]" />

      {/* Main content wrapper */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        {/* Wordmark Block */}
        <div className="mb-12 text-center">
          <h1 className="bg-bg-base font-display text-accent-primary inline-block border-2 border-black p-3 text-4xl font-black tracking-tighter uppercase shadow-[4px_4px_0px_#000] md:text-5xl">
            Ledga
          </h1>
          <p className="text-text-secondary mt-6 font-mono text-sm tracking-widest uppercase">
            Your family&apos;s finances, clearly.
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-bg-elevated relative w-full border-[3px] border-black p-8 shadow-[8px_8px_0px_#000] md:p-10">
          {/* Top accent bar */}
          <div className="bg-accent-primary absolute top-0 left-0 h-1 w-full" />

          {/* Card header */}
          <div className="mb-8">
            <h2 className="font-display text-text-primary text-2xl font-bold tracking-tight uppercase">
              Create Identity
            </h2>
            <p className="text-text-secondary mt-1 font-mono text-xs">
              Establish your ledger account
            </p>
          </div>

          {/* Error Box */}
          {error && (
            <div className="bg-bg-base border-accent-red mb-6 flex items-start gap-3 border-2 p-4">
              <AlertCircle size={18} className="text-accent-red" />
              <p className="text-accent-red font-mono text-sm">
                {decodeURIComponent(error)}
              </p>
            </div>
          )}

          <form action={signUpWithEmail} className="space-y-6">
            {/* Display Name Field */}
            <div>
              <label
                htmlFor="displayName"
                className="text-accent-primary mb-2 block font-mono text-[10px] tracking-widest uppercase"
              >
                Display Name
              </label>
              <div className="relative">
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  required
                  placeholder="Your name"
                  className="bg-bg-elevated font-body text-text-primary focus:border-accent-primary placeholder:text-text-secondary w-full border-2 border-black px-4 py-3 transition-all focus:shadow-[4px_4px_0px_var(--color-accent-primary)] focus:outline-none"
                />
                <User
                  size={18}
                  className="text-text-secondary absolute top-3 right-3"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="text-accent-primary mb-2 block font-mono text-[10px] tracking-widest uppercase"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="bg-bg-elevated font-body text-text-primary focus:border-accent-primary placeholder:text-text-secondary w-full border-2 border-black px-4 py-3 transition-all focus:shadow-[4px_4px_0px_var(--color-accent-primary)] focus:outline-none"
                />
                <AtSign
                  size={18}
                  className="text-text-secondary absolute top-3 right-3"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="text-accent-primary mb-2 block font-mono text-[10px] tracking-widest uppercase"
              >
                Security Key
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  placeholder="••••••••"
                  className="bg-bg-elevated font-body text-text-primary focus:border-accent-primary placeholder:text-text-secondary w-full border-2 border-black px-4 py-3 transition-all focus:shadow-[4px_4px_0px_var(--color-accent-primary)] focus:outline-none"
                />
                <Lock
                  size={18}
                  className="text-text-secondary absolute top-3 right-3"
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="text-accent-primary mb-2 block font-mono text-[10px] tracking-widest uppercase"
              >
                Confirm Key
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="bg-bg-elevated font-body text-text-primary focus:border-accent-primary placeholder:text-text-secondary w-full border-2 border-black px-4 py-3 transition-all focus:shadow-[4px_4px_0px_var(--color-accent-primary)] focus:outline-none"
                />
                <ShieldCheck
                  size={18}
                  className="text-text-secondary absolute top-3 right-3"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-accent-primary text-bg-base font-display group w-full border-[3px] border-black py-4 text-lg font-extrabold tracking-tight uppercase shadow-[4px_4px_0px_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000] active:translate-x-0 active:translate-y-0 active:shadow-none"
            >
              <span className="flex cursor-pointer items-center justify-center gap-2">
                Create Account
                <span className="transition-transform group-hover:translate-x-1">
                  <ArrowRight size={20} />
                </span>
              </span>
            </button>
          </form>

          {/* Footer — dashed divider + invitation notice */}
          <div className="mt-8 border-t-2 border-dashed border-black pt-6">
            <div className="bg-accent-red/10 border-accent-red flex items-start gap-3 border-2 p-4">
              <AlertCircle size={20} className="text-accent-red shrink-0" />
              <p className="text-text-secondary font-mono text-[11px] leading-relaxed">
                NOTICE: Access is by invitation only. Your email must be
                pre-approved. Unauthorized attempts are logged.
              </p>
            </div>
          </div>
        </div>

        {/* Secondary nav */}
        <div className="mt-8 text-center">
          <p className="text-text-secondary font-mono text-[10px] tracking-widest uppercase">
            Existing member?
            <Link
              href={ROUTES.LOGIN}
              className="text-accent-gold ml-2 font-bold hover:underline"
            >
              Authenticate Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
