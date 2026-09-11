import { createHash } from "node:crypto";
import { callGeminiJSON } from "../ai/gemini.client.js";
import {
  generatedApplicationSchema,
  jobExtractionSchema,
  resumeProfileSchema,
  scoreSchema
} from "../ai/schemas.js";
import { getCachedAI, setCachedAI } from "./ai-cache.service.js";
import { env } from "../config/env.js";

function cacheKey(prefix: string, payload: unknown) {
  return `${prefix}:${createHash("sha256").update(JSON.stringify(payload)).digest("hex")}`;
}

export async function analyzeResume(rawText: string) {
  const key = cacheKey("resume", rawText);
  const cached = await getCachedAI(key);
  if (cached) return resumeProfileSchema.parse(cached);

  const prompt = `Extract a resume profile in strict JSON with keys: name, education, skills, experience, projects, certifications, languages, preferredRoles, preferredLocations, experienceYears. Resume text:\n${rawText}`;
  const response = await callGeminiJSON(prompt, { model: env.GEMINI_MODEL_FAST });
  const parsed = resumeProfileSchema.parse(response);
  await setCachedAI(key, env.GEMINI_MODEL_FAST, parsed);
  return parsed;
}

export async function extractJob(rawText: string) {
  const key = cacheKey("jobextract", rawText);
  const cached = await getCachedAI(key);
  if (cached) return jobExtractionSchema.parse(cached);

  const prompt = `Extract structured job details in JSON with keys: title, company, location, applicationUrl, requirements, technologies, experienceRequired, employmentType, postedDate, description. If unknown, use UNKNOWN.`;
  const response = await callGeminiJSON(`${prompt}\n${rawText}`, { model: env.GEMINI_MODEL_FAST });
  const parsed = jobExtractionSchema.parse(response);
  await setCachedAI(key, env.GEMINI_MODEL_FAST, parsed);
  return parsed;
}

export async function scoreJob(input: { resumeProfile: object; job: object; localHints: object }) {
  const key = cacheKey("score", input);
  const cached = await getCachedAI(key);
  if (cached) return scoreSchema.parse(cached);

  const prompt = `Score this job for this candidate. Return JSON: skillMatch, experienceMatch, roleMatch, locationMatch, educationMatch, matchingSkills, missingSkills, recommendation, reason. ResumeProfile: ${JSON.stringify(
    input.resumeProfile
  )}. Job: ${JSON.stringify(input.job)}. Local hints: ${JSON.stringify(input.localHints)}. Avoid hallucinations.`;

  const response = await callGeminiJSON(prompt, { model: env.GEMINI_MODEL_SMART });
  const parsed = scoreSchema.parse(response);
  await setCachedAI(key, env.GEMINI_MODEL_SMART, parsed);
  return parsed;
}

export async function generateApplicationAnswers(input: {
  resumeProfile: object;
  job: object;
  company: string;
}) {
  const prompt = `Generate truthful JSON with coverLetter, summary, answers (keys: whyHireYou, tellMeAboutYourself, whyWorkHere, reactExperience). Use only resume facts. Resume: ${JSON.stringify(
    input.resumeProfile
  )}. Job: ${JSON.stringify(input.job)}.`;

  const response = await callGeminiJSON(prompt, { model: env.GEMINI_MODEL_SMART });
  return generatedApplicationSchema.parse(response);
}

export async function generateCoverLetter(input: {
  resumeProfile: object;
  job: object;
  company: string;
}) {
  const prompt = `Generate JSON with only one key coverLetter. Keep it short and truthful, use only provided resume data. Resume: ${JSON.stringify(
    input.resumeProfile
  )}. Job: ${JSON.stringify(input.job)}. Company: ${input.company}.`;
  const response = await callGeminiJSON(prompt, { model: env.GEMINI_MODEL_SMART });
  return generatedApplicationSchema.pick({ coverLetter: true }).parse(response);
}

export async function summarizeJob(job: object) {
  const prompt = `Summarize this job in concise JSON with title, company, topSkills, risks, fresherCompatibility. Data: ${JSON.stringify(
    job
  )}`;
  return callGeminiJSON(prompt, { model: env.GEMINI_MODEL_FAST });
}
