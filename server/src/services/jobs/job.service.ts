import { JobStatus, type Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/errors.js";
import { classifyFreshness } from "../../utils/freshness.js";
import { normalizeJob } from "./job-normalization.service.js";
import { classifyExperienceLevel, isRelevantRole } from "./job-filter.service.js";
import { calculateJobMatch } from "./job-match.service.js";
import { getEnabledSources } from "../../jobs/sources.registry.js";

export async function searchAndStoreJobs(userId: string) {
  const profile = await prisma.resumeProfile.findUnique({ where: { userId } });
  const pref = await prisma.searchPreference.findUnique({ where: { userId } });
  if (!profile || !pref) {
    throw new AppError(400, "Resume profile and preferences are required before scanning jobs");
  }

  const run = await prisma.scanRun.create({ data: { userId, mode: "DISCOVER" } });

  const sources = getEnabledSources();
  const discovered = (
    await Promise.all(
      sources.map((source) =>
        source.searchJobs({
          roles: pref.roles as string[],
          locations: pref.locations as string[],
          remote: pref.includeRemote
        })
      )
    )
  ).flat();

  let inserted = 0;
  let filtered = 0;

  for (const rawJob of discovered) {
    const normalized = normalizeJob(rawJob);
    const exists = await prisma.job.findFirst({
      where: {
        OR: [
          { canonicalUrl: normalized.canonicalUrl },
          { jobHash: normalized.jobHash },
          { sourceUrl: normalized.sourceUrl }
        ]
      }
    });

    if (exists || [JobStatus.APPLIED, JobStatus.REJECTED, JobStatus.CLOSED].includes(exists?.status ?? JobStatus.NEW)) {
      filtered += 1;
      continue;
    }

    const freshness = classifyFreshness(normalized.postedDate ?? null);
    if (freshness === "UNKNOWN") {
      filtered += 1;
      continue;
    }

    const experience = classifyExperienceLevel(normalized.experienceRequired);
    const relevantRole = isRelevantRole(normalized.title, pref.roles as string[]);
    if (!experience.isFresherFriendly || !relevantRole) {
      filtered += 1;
      continue;
    }

    const created = await prisma.job.create({
      data: {
        company: rawJob.company,
        companyWebsite: rawJob.companyWebsite,
        title: rawJob.title,
        description: rawJob.description,
        requirements: rawJob.requirements ?? [],
        location: rawJob.location,
        employmentType: rawJob.employmentType,
        experienceRequired: rawJob.experienceRequired,
        technologies: rawJob.technologies ?? [],
        source: rawJob.source,
        sourceUrl: rawJob.sourceUrl,
        applicationUrl: rawJob.applicationUrl,
        canonicalUrl: normalized.canonicalUrl,
        postedDate: rawJob.postedDate,
        jobHash: normalized.jobHash,
        status: JobStatus.NEW,
        isNew: true,
        isRemote: /remote/i.test(rawJob.location),
        aiStatus: "PENDING"
      }
    });

    inserted += 1;

    try {
      const match = await calculateJobMatch({
        resumeProfile: profile as unknown as Record<string, any>,
        job: created as unknown as Record<string, any>
      });

      await prisma.jobMatch.upsert({
        where: { userId_jobId: { userId, jobId: created.id } },
        update: {
          matchScore: match.matchScore,
          skillMatch: match.skillMatch,
          experienceMatch: match.experienceMatch,
          roleMatch: match.roleMatch,
          locationMatch: match.locationMatch,
          educationMatch: match.educationMatch,
          freshnessScore: match.freshnessScore,
          matchingSkills: match.matchingSkills,
          missingSkills: match.missingSkills,
          experienceRequirement: created.experienceRequired,
          recommendation: match.recommendation,
          reason: match.reason
        },
        create: {
          userId,
          jobId: created.id,
          matchScore: match.matchScore,
          skillMatch: match.skillMatch,
          experienceMatch: match.experienceMatch,
          roleMatch: match.roleMatch,
          locationMatch: match.locationMatch,
          educationMatch: match.educationMatch,
          freshnessScore: match.freshnessScore,
          matchingSkills: match.matchingSkills,
          missingSkills: match.missingSkills,
          experienceRequirement: created.experienceRequired,
          recommendation: match.recommendation,
          reason: match.reason
        }
      });

      await prisma.job.update({ where: { id: created.id }, data: { aiStatus: "READY" } });
    } catch {
      await prisma.job.update({ where: { id: created.id }, data: { aiStatus: "PENDING" } });
    }
  }

  await prisma.scanRun.update({
    where: { id: run.id },
    data: {
      completedAt: new Date(),
      status: "COMPLETED",
      jobsDiscovered: discovered.length,
      jobsInserted: inserted,
      jobsFiltered: filtered
    }
  });

  return { discovered: discovered.length, inserted, filtered };
}

export async function listJobs(userId: string, query: Prisma.JobWhereInput = {}) {
  return prisma.job.findMany({
    where: {
      ...query,
      matches: { some: { userId } }
    },
    include: {
      matches: {
        where: { userId }
      }
    },
    orderBy: [{ postedDate: "desc" }, { discoveredAt: "desc" }]
  });
}

export async function getJobById(jobId: string, userId: string) {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { matches: { where: { userId } } }
  });

  if (!job) {
    throw new AppError(404, "Job not found");
  }

  return job;
}

export async function updateJobStatus(jobId: string, status: JobStatus) {
  return prisma.job.update({ where: { id: jobId }, data: { status, isNew: status === JobStatus.NEW } });
}

export async function shortlistJob(userId: string, jobId: string) {
  await prisma.savedJob.upsert({
    where: { userId_jobId: { userId, jobId } },
    update: {},
    create: { userId, jobId }
  });

  return updateJobStatus(jobId, JobStatus.SHORTLISTED);
}
