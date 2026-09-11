import { AppMode } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/errors.js";
import { generateApplicationAnswers } from "../ai.service.js";

export async function prepareApplication(userId: string, jobId: string) {
  const [job, profile] = await Promise.all([
    prisma.job.findUnique({ where: { id: jobId } }),
    prisma.resumeProfile.findUnique({ where: { userId } })
  ]);

  if (!job || !profile) {
    throw new AppError(400, "Job and resume profile are required");
  }

  const generated = await generateApplicationAnswers({
    resumeProfile: profile as unknown as Record<string, unknown>,
    job: job as unknown as Record<string, unknown>,
    company: job.company
  });

  return prisma.application.upsert({
    where: { userId_jobId: { userId, jobId } },
    update: {
      coverLetter: generated.coverLetter,
      applicationSummary: generated.summary,
      generatedAnswers: generated.answers,
      status: "PREPARED",
      mode: AppMode.PREPARE
    },
    create: {
      userId,
      jobId,
      coverLetter: generated.coverLetter,
      applicationSummary: generated.summary,
      generatedAnswers: generated.answers,
      status: "PREPARED",
      mode: AppMode.PREPARE
    }
  });
}

export async function confirmApplication(userId: string, id: string) {
  const app = await prisma.application.findFirst({ where: { id, userId } });
  if (!app) {
    throw new AppError(404, "Application not found");
  }

  const updated = await prisma.application.update({
    where: { id },
    data: {
      status: "CONFIRMED",
      confirmedAt: new Date(),
      mode: AppMode.APPLY
    }
  });

  await prisma.job.update({ where: { id: app.jobId }, data: { status: "APPLIED" } });
  return updated;
}

export async function listApplications(userId: string) {
  return prisma.application.findMany({
    where: { userId },
    include: {
      job: true
    },
    orderBy: { updatedAt: "desc" }
  });
}

export async function getApplication(userId: string, id: string) {
  const app = await prisma.application.findFirst({ where: { userId, id }, include: { job: true } });
  if (!app) {
    throw new AppError(404, "Application not found");
  }

  return app;
}
