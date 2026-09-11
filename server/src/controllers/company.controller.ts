import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/express.js";
import { AppError } from "../utils/errors.js";
import { discoverCompany, getCompanyDetails } from "../services/companies/company.service.js";

export async function searchCompany(req: AuthenticatedRequest, res: Response) {
  if (!req.user) throw new AppError(401, "Authentication required");
  const result = await discoverCompany(req.body.company, req.user.userId);
  res.json(result);
}

export async function getCompany(req: AuthenticatedRequest, res: Response) {
  if (!req.user) throw new AppError(401, "Authentication required");
  const details = await getCompanyDetails(req.params.id, req.user.userId);
  res.json(details);
}
