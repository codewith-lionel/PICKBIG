import { z } from "zod";

export const resumeProfileSchema = z.object({
  name: z.string().optional().default(""),
  education: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  experience: z.array(z.string()).default([]),
  projects: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  preferredRoles: z.array(z.string()).default([]),
  preferredLocations: z.array(z.string()).default([]),
  experienceYears: z.number().min(0).default(0)
});

export const jobExtractionSchema = z.object({
  title: z.string(),
  company: z.string(),
  location: z.string(),
  applicationUrl: z.string(),
  requirements: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  experienceRequired: z.string().default("UNKNOWN"),
  employmentType: z.string().optional(),
  postedDate: z.string().optional(),
  description: z.string().optional()
});

export const scoreSchema = z.object({
  skillMatch: z.number().min(0).max(100),
  experienceMatch: z.number().min(0).max(100),
  roleMatch: z.number().min(0).max(100),
  locationMatch: z.number().min(0).max(100),
  educationMatch: z.number().min(0).max(100),
  matchingSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  recommendation: z.enum(["STRONG_MATCH", "GOOD_MATCH", "WEAK_MATCH", "REJECT"]),
  reason: z.string()
});

export const generatedApplicationSchema = z.object({
  coverLetter: z.string(),
  summary: z.string(),
  answers: z.record(z.string(), z.string())
});
