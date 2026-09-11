import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/express.js";
import { AppError } from "../utils/errors.js";
import { getDashboardStats } from "../services/dashboard.service.js";

export async function stats(req: AuthenticatedRequest, res: Response) {
  if (!req.user) throw new AppError(401, "Authentication required");
  const result = await getDashboardStats(req.user.userId);
  res.json(result);
}
