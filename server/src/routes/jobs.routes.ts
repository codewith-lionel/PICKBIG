import { Router } from "express";
import {
  analyzeJob,
  coverLetter,
  getJob,
  getJobs,
  searchJobs,
  shortlist,
  updateStatus
} from "../controllers/jobs.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema, searchJobsSchema, updateStatusSchema } from "../validators/jobs.validator.js";

export const jobsRouter = Router();

jobsRouter.post("/search", requireAuth, validate(searchJobsSchema), searchJobs);
jobsRouter.get("/", requireAuth, getJobs);
jobsRouter.get("/:id", requireAuth, validate(idParamSchema), getJob);
jobsRouter.post("/:id/analyze", requireAuth, validate(idParamSchema), analyzeJob);
jobsRouter.post("/:id/shortlist", requireAuth, validate(idParamSchema), shortlist);
jobsRouter.patch("/:id/status", requireAuth, validate(updateStatusSchema), updateStatus);
jobsRouter.post("/:id/cover-letter", requireAuth, validate(idParamSchema), coverLetter);
