import { prisma } from "../../config/prisma.js";
import { normalizeString } from "../../utils/strings.js";

export async function discoverCompany(company: string, userId: string) {
  const normalized = normalizeString(company);

  const jobs = await prisma.job.findMany({
    where: {
      company: {
        contains: normalized,
        mode: "insensitive"
      },
      matches: { some: { userId } },
      status: "NEW"
    },
    include: {
      matches: {
        where: { userId },
        take: 1
      }
    },
    orderBy: [{ postedDate: "desc" }, { discoveredAt: "desc" }]
  });

  const latest = jobs[0];

  return {
    company,
    officialWebsite: latest?.companyWebsite ?? "UNKNOWN",
    careersPage: latest?.applicationUrl ?? "UNKNOWN",
    currentMatchingJobs: jobs,
    latestMatchingJob: latest ?? null,
    location: latest?.location ?? "UNKNOWN",
    postedDate: latest?.postedDate ?? null,
    matchScore: latest?.matches?.[0]?.matchScore ?? 0,
    applicationUrl: latest?.applicationUrl ?? "UNKNOWN"
  };
}

export async function getCompanyDetails(id: string, userId: string) {
  const job = await prisma.job.findUnique({
    where: { id },
    include: { matches: { where: { userId }, take: 1 } }
  });

  if (!job) {
    return null;
  }

  return {
    company: job.company,
    officialWebsite: job.companyWebsite ?? "UNKNOWN",
    careersPage: job.applicationUrl,
    latestMatchingJob: job,
    matchScore: job.matches[0]?.matchScore ?? 0
  };
}
