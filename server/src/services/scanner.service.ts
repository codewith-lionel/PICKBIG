import { prisma } from "../config/prisma.js";
import { searchAndStoreJobs } from "./jobs/job.service.js";

export async function runScanner(userId: string) {
  return searchAndStoreJobs(userId);
}

export async function getScannerStatus(userId: string) {
  return prisma.scanRun.findFirst({
    where: { userId },
    orderBy: { startedAt: "desc" }
  });
}
