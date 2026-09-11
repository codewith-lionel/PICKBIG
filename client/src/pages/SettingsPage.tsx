export function SettingsPage() {
  return (
    <section className="space-y-3 rounded border bg-white p-4">
      <h2 className="text-2xl font-semibold">Settings</h2>
      <p className="text-sm text-slate-600">Configure preferred roles, locations, freshness filters, and minimum match score.</p>
      <p className="text-sm text-slate-600">Current defaults: last 7 days, fresher-friendly, match score ≥ 70%.</p>
    </section>
  );
}
