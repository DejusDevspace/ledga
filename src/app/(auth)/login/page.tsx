import Link from "next/link";
import { signInWithEmail, signInWithGoogle } from "@/lib/supabase/actions";
import { ROUTES } from "@/constants/routes";
import { AlertCircle, Mail, Lock } from "lucide-react";

export default async function LoginPage({
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

        {/* Login Card */}
        <div className="bg-bg-elevated w-full border-[3px] border-black p-8 shadow-[8px_8px_0px_#000] md:p-10">
          {/* Error Box */}
          {error && (
            <div className="bg-bg-base border-accent-red mb-6 flex items-start gap-3 border-2 p-4">
              <AlertCircle size={18} className="text-accent-red" />
              <p className="text-accent-red font-mono text-sm">
                {decodeURIComponent(error)}
              </p>
            </div>
          )}

          <form action={signInWithEmail} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-text-secondary flex items-center gap-2 font-mono text-xs font-bold tracking-tight uppercase"
              >
                <Mail size={16} />
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="your@email.com"
                className="bg-bg-base font-body text-text-primary focus:border-accent-primary placeholder:text-text-secondary w-full border-2 border-black p-4 transition-all focus:shadow-[4px_4px_0px_var(--color-accent-primary)] focus:outline-none"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-text-secondary flex items-center gap-2 font-mono text-xs font-bold tracking-tight uppercase"
                >
                  <Lock size={16} />
                  Password
                </label>
                <a
                  href="#"
                  className="text-accent-primary font-mono text-[10px] uppercase hover:underline"
                >
                  Forgot?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="bg-bg-base font-body text-text-primary focus:border-accent-primary placeholder:text-text-secondary w-full border-2 border-black p-4 transition-all focus:shadow-[4px_4px_0px_var(--color-accent-primary)] focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-accent-primary text-bg-base font-display w-full cursor-pointer border-[3px] border-black py-4 text-lg font-extrabold tracking-tight uppercase shadow-[4px_4px_0px_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000] active:translate-x-0 active:translate-y-0 active:shadow-none"
            >
              Sign In
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="grow border-t-2 border-black/20"></div>
              <span className="text-text-secondary mx-4 font-mono text-[10px] uppercase">
                OR CONTINUE VIA
              </span>
              <div className="grow border-t-2 border-black/20"></div>
            </div>

            {/* Google Button */}
            <button
              formAction={signInWithGoogle}
              type="submit"
              className="text-text-primary font-display hover:bg-bg-elevated text-md flex w-full cursor-pointer items-center justify-center gap-3 border-2 border-black bg-transparent py-3 font-bold transition-colors hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.01 24.01 0 0 0 0 21.56l7.98-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.47 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              Continue with Google
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="font-body text-text-secondary text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href={ROUTES.SIGNUP}
                className="text-accent-gold hover:text-accent-gold/80 font-bold underline decoration-2 underline-offset-4"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
