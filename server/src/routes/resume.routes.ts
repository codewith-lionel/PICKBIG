import { Router } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { requireAuth } from "../middleware/auth.js";
import { getProfile, getResume, uploadResume } from "../controllers/resume.controller.js";
import { AppError } from "../utils/errors.js";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowed.includes(file.mimetype)) {
      cb(new AppError(400, "Only PDF or DOCX files are allowed"));
      return;
    }

    cb(null, true);
  }
});

export const resumeRouter = Router();

resumeRouter.post("/upload", requireAuth, upload.single("resume"), uploadResume);
resumeRouter.get("/", requireAuth, getResume);
resumeRouter.get("/profile", requireAuth, getProfile);
