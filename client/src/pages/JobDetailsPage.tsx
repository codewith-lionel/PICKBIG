import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";

export function JobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    if (id) {
      api.get(`/jobs/${id}`).then((response) => setJob(response.data));
    }
  }, [id]);

  if (!job) return <p>Loading job...</p>;

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">{job.title}</h2>
      <p>{job.company}</p>
      <pre className="overflow-auto rounded border bg-white p-4 text-xs">{JSON.stringify(job, null, 2)}</pre>
    </section>
  );
}
