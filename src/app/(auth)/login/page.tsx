import Link from "next/link";
import { signInWithEmail, signInWithGoogle } from "@/lib/supabase/actions";
import { ROUTES } from "@/constants/routes";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="w-full max-w-md">
      {/* Wordmark */}
      <div className="mb-8 text-center">
        <span className="font-display text-accent-primary inline-block border-2 border-(--color-border) px-4 py-2 text-4xl font-extrabold shadow-[6px_6px_0px_#000]">
          Ledga
        </span>
        <p className="text-text-secondary mt-3 text-sm">
          Your family&apos;s finances, clearly.
        </p>
      </div>

      {/* Login Card */}
      <div className="card-brutalist-lg">
        <h1 className="font-display text-text-primary mb-6 text-2xl font-bold">
          Welcome back
        </h1>

        {/* Error Banner */}
        {error && (
          <div className="bg-bg-elevated border-accent-red text-accent-red mb-4 border-2 p-3 text-sm">
            {decodeURIComponent(error)}
          </div>
        )}

        {/* Email/Password Form */}
        <form action={signInWithEmail} className="flex flex-col gap-4">
          <div>
            <label className="text-text-secondary mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="input-brutalist"
            />
          </div>

          <div>
            <label className="text-text-secondary mb-1 block text-sm font-medium">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="input-brutalist"
            />
          </div>

          <button
            type="submit"
            className="btn-primary mt-2 w-full justify-center"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="bg-divider h-px flex-1" />
          <span className="text-text-secondary text-xs">or</span>
          <div className="bg-divider h-px flex-1" />
        </div>

        {/* Google Button */}
        <form action={signInWithGoogle}>
          <button
            type="submit"
            className="btn-outlined w-full justify-center"
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
      </div>

      {/* Footer */}
      <p className="text-text-secondary mt-6 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href={ROUTES.SIGNUP}
          className="text-accent-primary underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
