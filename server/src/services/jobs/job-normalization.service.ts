import { canonicalizeUrl } from "../../utils/url.js";
import { buildJobHash } from "../../utils/hash.js";
import { normalizeString } from "../../utils/strings.js";
import type { DiscoveredJob } from "../../jobs/job-source.interface.js";

export function normalizeJob(job: DiscoveredJob) {
  const normalizedCompany = normalizeString(job.company);
  const normalizedTitle = normalizeString(job.title);
  const normalizedLocation = normalizeString(job.location);
  const canonicalUrl = canonicalizeUrl(job.applicationUrl || job.sourceUrl);

  return {
    ...job,
    company: normalizedCompany,
    title: normalizedTitle,
    location: normalizedLocation,
    canonicalUrl,
    jobHash: buildJobHash({
      company: normalizedCompany,
      title: normalizedTitle,
      location: normalizedLocation,
      applicationUrl: canonicalUrl
    })
  };
}
