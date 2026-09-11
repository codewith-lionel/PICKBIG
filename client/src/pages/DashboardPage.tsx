import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { DashboardStats } from "../types/api";
import { StatCard } from "../components/StatCard";

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    api.get("/dashboard/stats").then((response) => setStats(response.data));
  }, []);

  if (!stats) return <p>Loading dashboard…</p>;

  return (
    <section>
      <h2 className="text-2xl font-semibold">🔥 New Jobs Dashboard</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <StatCard label="New jobs today" value={stats.newJobs} />
        <StatCard label="Strong matches" value={stats.strongMatches} />
        <StatCard label="Applications sent" value={stats.applicationsSent} />
        <StatCard label="Shortlisted" value={stats.shortlisted} />
        <StatCard label="Rejected" value={stats.rejected} />
        <StatCard label="Closed" value={stats.closed} />
      </div>
    </section>
  );
}
