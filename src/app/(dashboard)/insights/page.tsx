export default function InsightsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-text-primary text-3xl font-bold">
          Insights
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card-brutalist-lg flex min-h-75 items-center justify-center">
          <p className="text-text-secondary">Spending Donut Chart</p>
        </div>
        <div className="card-brutalist-lg flex min-h-75 items-center justify-center">
          <p className="text-text-secondary">Top Categories List</p>
        </div>
        <div className="card-brutalist-lg flex min-h-75 items-center justify-center lg:col-span-2">
          <p className="text-text-secondary">Cashflow Trend Chart</p>
        </div>
      </div>
    </div>
  );
}
