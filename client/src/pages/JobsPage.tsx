import { useEffect, useState } from "react";
import { JobCard } from "../components/JobCard";
import { api } from "../services/api";
import type { Job } from "../types/api";

export function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadJobs() {
    const response = await api.get("/jobs");
    setJobs(response.data);
  }

  useEffect(() => {
    loadJobs();
  }, []);

  async function runScanner() {
    setLoading(true);
    try {
      await api.post("/scanner/run");
      await loadJobs();
    } finally {
      setLoading(false);
    }
  }

  async function shortlist(id: string) {
    await api.post(`/jobs/${id}/shortlist`);
    await loadJobs();
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">New Jobs</h2>
        <button onClick={runScanner} disabled={loading} className="rounded bg-brand-600 px-3 py-2 text-sm text-white">
          {loading ? "Scanning..." : "Run Scanner"}
        </button>
      </div>
      <div className="grid gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} onShortlist={shortlist} />
        ))}
      </div>
    </section>
  );
}
