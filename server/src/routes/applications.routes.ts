import { Router } from "express";
import { confirm, getAll, getOne, prepare } from "../controllers/application.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { prepareApplicationSchema } from "../validators/application.validator.js";
import { idParamSchema } from "../validators/jobs.validator.js";

export const applicationsRouter = Router();

applicationsRouter.post("/prepare", requireAuth, validate(prepareApplicationSchema), prepare);
applicationsRouter.get("/", requireAuth, getAll);
applicationsRouter.get("/:id", requireAuth, validate(idParamSchema), getOne);
applicationsRouter.post("/:id/confirm", requireAuth, validate(idParamSchema), confirm);
