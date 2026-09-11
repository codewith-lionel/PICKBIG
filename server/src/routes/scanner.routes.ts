import { Router } from "express";
import { run, status } from "../controllers/scanner.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const scannerRouter = Router();

scannerRouter.post("/run", requireAuth, run);
scannerRouter.get("/status", requireAuth, status);
