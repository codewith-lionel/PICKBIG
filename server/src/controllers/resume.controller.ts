import type { Response } from "express";
import { AppError } from "../utils/errors.js";
import { getLatestResume, getResumeProfile, saveResume } from "../services/resume/resume.service.js";
import type { AuthenticatedRequest } from "../types/express.js";

export async function uploadResume(req: AuthenticatedRequest, res: Response) {
  if (!req.user) throw new AppError(401, "Authentication required");
  if (!req.file) throw new AppError(400, "Resume file is required");

  const resume = await saveResume({
    userId: req.user.userId,
    fileName: req.file.originalname,
    fileType: req.file.mimetype,
    fileSize: req.file.size,
    filePath: req.file.path
  });

  res.status(201).json(resume);
}

export async function getResume(req: AuthenticatedRequest, res: Response) {
  if (!req.user) throw new AppError(401, "Authentication required");
  const resume = await getLatestResume(req.user.userId);
  res.json(resume);
}

export async function getProfile(req: AuthenticatedRequest, res: Response) {
  if (!req.user) throw new AppError(401, "Authentication required");
  const profile = await getResumeProfile(req.user.userId);
  res.json(profile);
}
