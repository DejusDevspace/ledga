export default function SignupPage() {
  return (
    <div className="w-full max-w-md">
      <div className="card-brutalist-lg mb-4">
        <h1 className="font-display text-text-primary mb-2 text-3xl font-bold">
          Create account
        </h1>
        <p className="text-text-secondary mb-6">
          Join your family&apos;s Ledga workspace
        </p>

        {/* TODO: wire up Supabase auth */}
        <form className="flex flex-col gap-4">
          <div>
            <label className="text-text-primary] mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              className="input-brutalist"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-text-primary mb-1 block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              className="input-brutalist"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn-primary mt-2 w-full justify-center"
          >
            Sign Up
          </button>
        </form>
      </div>

      <div className="border-accent-gold bg-bg-surface text-text-secondary border-l-4 p-4 text-sm">
        <strong>Note:</strong> Ledga is currently by invitation only. Make sure
        you have been invited before creating an account.
      </div>
    </div>
  );
}
