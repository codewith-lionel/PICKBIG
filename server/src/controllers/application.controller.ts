import type { Response } from "express";
import { AppError } from "../utils/errors.js";
import type { AuthenticatedRequest } from "../types/express.js";
import {
  confirmApplication,
  getApplication,
  listApplications,
  prepareApplication
} from "../services/applications/application.service.js";

export async function prepare(req: AuthenticatedRequest, res: Response) {
  if (!req.user) throw new AppError(401, "Authentication required");
  const app = await prepareApplication(req.user.userId, req.body.jobId);
  res.status(201).json(app);
}

export async function getAll(req: AuthenticatedRequest, res: Response) {
  if (!req.user) throw new AppError(401, "Authentication required");
  const apps = await listApplications(req.user.userId);
  res.json(apps);
}

export async function getOne(req: AuthenticatedRequest, res: Response) {
  if (!req.user) throw new AppError(401, "Authentication required");
  const app = await getApplication(req.user.userId, req.params.id);
  res.json(app);
}

export async function confirm(req: AuthenticatedRequest, res: Response) {
  if (!req.user) throw new AppError(401, "Authentication required");
  const app = await confirmApplication(req.user.userId, req.params.id);
  res.json({
    ...app,
    message: "Review application complete. Confirmed and marked as applied."
  });
}
