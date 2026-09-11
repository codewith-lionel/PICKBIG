import { Router } from "express";
import { getCompany, searchCompany } from "../controllers/company.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { companySearchSchema } from "../validators/company.validator.js";
import { idParamSchema } from "../validators/jobs.validator.js";

export const companiesRouter = Router();

companiesRouter.post("/search", requireAuth, validate(companySearchSchema), searchCompany);
companiesRouter.get("/:id", requireAuth, validate(idParamSchema), getCompany);
