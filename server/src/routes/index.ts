import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { resumeRouter } from "./resume.routes.js";
import { jobsRouter } from "./jobs.routes.js";
import { applicationsRouter } from "./applications.routes.js";
import { companiesRouter } from "./companies.routes.js";
import { scannerRouter } from "./scanner.routes.js";
import { dashboardRouter } from "./dashboard.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/resume", resumeRouter);
apiRouter.use("/jobs", jobsRouter);
apiRouter.use("/applications", applicationsRouter);
apiRouter.use("/companies", companiesRouter);
apiRouter.use("/scanner", scannerRouter);
apiRouter.use("/dashboard", dashboardRouter);
