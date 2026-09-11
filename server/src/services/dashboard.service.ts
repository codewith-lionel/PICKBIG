import { JobStatus } from "@prisma/client";
import { prisma } from "../config/prisma.js";

export async function getDashboardStats(userId: string) {
  const [jobs, strongMatches, applications] = await Promise.all([
    prisma.job.groupBy({
      by: ["status"],
      _count: { _all: true }
    }),
    prisma.jobMatch.count({ where: { userId, matchScore: { gte: 85 } } }),
    prisma.application.count({ where: { userId } })
  ]);

  const map = Object.fromEntries(jobs.map((entry) => [entry.status, entry._count._all]));

  return {
    newJobs: map[JobStatus.NEW] ?? 0,
    shortlisted: map[JobStatus.SHORTLISTED] ?? 0,
    applied: map[JobStatus.APPLIED] ?? 0,
    rejected: map[JobStatus.REJECTED] ?? 0,
    closed: map[JobStatus.CLOSED] ?? 0,
    strongMatches,
    applicationsSent: applications,
    jobsDiscovered: Object.values(map).reduce((sum, value) => sum + Number(value), 0)
  };
}
