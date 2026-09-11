import { prisma } from "../../config/prisma.js";
import { analyzeResume } from "../ai.service.js";
import { parseResumeFile } from "./resume-parser.service.js";

export async function saveResume(input: {
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
}) {
  const extractedText = await parseResumeFile(input.filePath, input.fileType);

  const resume = await prisma.resume.create({
    data: {
      userId: input.userId,
      fileName: input.fileName,
      fileType: input.fileType,
      fileSize: input.fileSize,
      storagePath: input.filePath,
      extractedText
    }
  });

  const profile = await analyzeResume(extractedText);

  await prisma.resumeProfile.upsert({
    where: { userId: input.userId },
    update: {
      name: profile.name,
      education: profile.education,
      skills: profile.skills,
      experience: profile.experience,
      projects: profile.projects,
      certifications: profile.certifications,
      languages: profile.languages,
      preferredRoles: profile.preferredRoles,
      preferredLocations: profile.preferredLocations,
      experienceYears: profile.experienceYears,
      sourceResumeId: resume.id
    },
    create: {
      userId: input.userId,
      name: profile.name,
      education: profile.education,
      skills: profile.skills,
      experience: profile.experience,
      projects: profile.projects,
      certifications: profile.certifications,
      languages: profile.languages,
      preferredRoles: profile.preferredRoles,
      preferredLocations: profile.preferredLocations,
      experienceYears: profile.experienceYears,
      sourceResumeId: resume.id
    }
  });

  return resume;
}

export async function getLatestResume(userId: string) {
  return prisma.resume.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
}

export async function getResumeProfile(userId: string) {
  return prisma.resumeProfile.findUnique({ where: { userId } });
}
