import type { Response } from "express";
import { AppError } from "../utils/errors.js";
import type { AuthenticatedRequest } from "../types/express.js";
import { getJobById, listJobs, searchAndStoreJobs, shortlistJob, updateJobStatus } from "../services/jobs/job.service.js";
import { calculateJobMatch } from "../services/jobs/job-match.service.js";
import { prisma } from "../config/prisma.js";
import { generateCoverLetter } from "../services/ai.service.js";

export async function searchJobs(req: AuthenticatedRequest, res: Response) {
  if (!req.user) throw new AppError(401, "Authentication required");
  const result = await searchAndStoreJobs(req.user.userId);
  res.json(result);
}

export async function getJobs(req: AuthenticatedRequest, res: Response) {
  if (!req.user) throw new AppError(401, "Authentication required");
  const jobs = await listJobs(req.user.userId, {
    status: typeof req.query.status === "string" ? (req.query.status as any) : undefined
  });
  res.json(jobs);
}

export async function getJob(req: AuthenticatedRequest, res: Response) {
  if (!req.user) throw new AppError(401, "Authentication required");
  const job = await getJobById(String(req.params.id), req.user.userId);
  res.json(job);
}

export async function analyzeJob(req: AuthenticatedRequest, res: Response) {
  if (!req.user) throw new AppError(401, "Authentication required");

  const [job, profile] = await Promise.all([
    prisma.job.findUnique({ where: { id: String(req.params.id) } }),
    prisma.resumeProfile.findUnique({ where: { userId: req.user.userId } })
  ]);

  if (!job || !profile) throw new AppError(404, "Job or resume profile not found");

  const match = await calculateJobMatch({
    resumeProfile: profile as unknown as Record<string, any>,
    job: job as unknown as Record<string, any>
  });

  const row = await prisma.jobMatch.upsert({
    where: { userId_jobId: { userId: req.user.userId, jobId: job.id } },
    create: {
      userId: req.user.userId,
      jobId: job.id,
      matchScore: match.matchScore,
      skillMatch: match.skillMatch,
      experienceMatch: match.experienceMatch,
      roleMatch: match.roleMatch,
      locationMatch: match.locationMatch,
      educationMatch: match.educationMatch,
      freshnessScore: match.freshnessScore,
      matchingSkills: match.matchingSkills,
      missingSkills: match.missingSkills,
      recommendation: match.recommendation,
      reason: match.reason
    },
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
      recommendation: match.recommendation,
      reason: match.reason
    }
  });

  res.json(row);
}

export async function shortlist(req: AuthenticatedRequest, res: Response) {
  if (!req.user) throw new AppError(401, "Authentication required");
  const job = await shortlistJob(req.user.userId, String(req.params.id));
  res.json(job);
}

export async function updateStatus(req: AuthenticatedRequest, res: Response) {
  const job = await updateJobStatus(String(req.params.id), req.body.status);
  res.json(job);
}

export async function coverLetter(req: AuthenticatedRequest, res: Response) {
  if (!req.user) throw new AppError(401, "Authentication required");

  const [job, profile] = await Promise.all([
    prisma.job.findUnique({ where: { id: String(req.params.id) } }),
    prisma.resumeProfile.findUnique({ where: { userId: req.user.userId } })
  ]);

  if (!job || !profile) throw new AppError(404, "Job or resume profile not found");

  const result = await generateCoverLetter({
    resumeProfile: profile as unknown as Record<string, unknown>,
    job: job as unknown as Record<string, unknown>,
    company: job.company
  });

  res.json(result);
}
