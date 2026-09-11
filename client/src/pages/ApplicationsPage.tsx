import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Application } from "../types/api";

export function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);

  async function load() {
    const response = await api.get("/applications");
    setApplications(response.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function confirm(id: string) {
    await api.post(`/applications/${id}/confirm`);
    await load();
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Applications</h2>
      {applications.map((application) => (
        <article key={application.id} className="rounded border bg-white p-4">
          <h3 className="font-semibold">{application.job.title}</h3>
          <p className="text-sm text-slate-600">{application.job.company}</p>
          <p className="mt-2 text-sm">Status: {application.status}</p>
          <details className="mt-2">
            <summary className="cursor-pointer text-sm text-brand-600">Review application</summary>
            <p className="mt-2 whitespace-pre-wrap text-sm">{application.coverLetter}</p>
          </details>
          <button className="mt-3 rounded bg-brand-600 px-3 py-2 text-sm text-white" onClick={() => confirm(application.id)}>
            Confirm and Submit
          </button>
        </article>
      ))}
    </section>
  );
}
