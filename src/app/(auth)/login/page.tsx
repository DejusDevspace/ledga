export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <div className="card-brutalist-lg">
        <h1 className="font-display text-text-primary mb-2 text-3xl font-bold">
          Welcome back
        </h1>
        <p className="text-text-secondary mb-6">Log in to your Ledga account</p>

        {/* TODO: wire up Supabase auth */}
        <form className="flex flex-col gap-4">
          <div>
            <label className="text-text-primary mb-1 block text-sm font-medium">
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
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
