export default function ReportsPage() {
  // DUMMY ARRAY
  const reports = [
    { title: "Jan 2025 Report", status: "Generated" },
    { title: "Feb 2025 Report", status: "Generated" },
    { title: "Mar 2025 Report", status: "Pending" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-text-primary text-3xl font-bold">
          Reports
        </h1>
        <p className="text-text-secondary mt-2">Monthly financial snapshots</p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((r, i) => (
          <div key={i} className="card-brutalist flex flex-col gap-4">
            <h3 className="font-display text-lg font-bold">{r.title}</h3>
            <span
              className={`badge ${r.status === "Generated" ? "badge-income" : "badge-elevated"} self-start`}
            >
              {r.status}
            </span>
            <button
              className="btn-outlined mt-auto w-full justify-center"
              disabled={r.status !== "Generated"}
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
