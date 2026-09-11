import { BriefcaseBusiness, MapPin } from "lucide-react";
import type { Job } from "../types/api";

interface Props {
  job: Job;
  onShortlist: (id: string) => void;
}

export function JobCard({ job, onShortlist }: Props) {
  const match = job.matches?.[0];

  return (
    <article className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{job.title}</h3>
        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
          {match?.matchScore ?? 0}% match
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-600">{job.company}</p>
      <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
        <span className="inline-flex items-center gap-1">
          <MapPin size={14} /> {job.location}
        </span>
        <span className="inline-flex items-center gap-1">
          <BriefcaseBusiness size={14} /> {job.source}
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-600">
        {job.postedDate ? `Posted: ${new Date(job.postedDate).toLocaleString()}` : "Posting date unavailable"}
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {(match?.matchingSkills ?? []).slice(0, 5).map((skill) => (
          <span key={skill} className="rounded bg-emerald-50 px-2 py-1 text-emerald-700">
            {skill}
          </span>
        ))}
      </div>
      {match?.missingSkills?.length ? (
        <p className="mt-3 text-xs text-amber-700">Missing: {match.missingSkills.join(", ")}</p>
      ) : null}
      <div className="mt-4 flex gap-2">
        <a
          href={job.applicationUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-500"
        >
          Open Application
        </a>
        <button
          type="button"
          onClick={() => onShortlist(job.id)}
          className="rounded border px-3 py-2 text-sm hover:bg-slate-50"
        >
          Shortlist
        </button>
      </div>
    </article>
  );
}
