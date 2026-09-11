import { Router } from "express";
import { stats } from "../controllers/dashboard.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const dashboardRouter = Router();

dashboardRouter.get("/stats", requireAuth, stats);
