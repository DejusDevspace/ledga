export default function SheetsSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-text-primary text-2xl font-bold">
          Connected Sheets
        </h1>
      </header>
      <div className="card-brutalist flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-sm border-2 border-(--color-border) p-4">
          <div>
            <p className="font-bold">Main — 2025</p>
            <p className="text-text-secondary text-xs">Primary Sheet</p>
          </div>
          <span className="badge badge-primary">Active</span>
        </div>
        <button className="btn-outlined self-start">Connect New Sheet</button>
      </div>
    </div>
  );
}
