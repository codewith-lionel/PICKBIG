import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/express.js";
import { AppError } from "../utils/errors.js";
import { getScannerStatus, runScanner } from "../services/scanner.service.js";

export async function run(req: AuthenticatedRequest, res: Response) {
  if (!req.user) throw new AppError(401, "Authentication required");
  const result = await runScanner(req.user.userId);
  res.json(result);
}

export async function status(req: AuthenticatedRequest, res: Response) {
  if (!req.user) throw new AppError(401, "Authentication required");
  const result = await getScannerStatus(req.user.userId);
  res.json(result);
}
