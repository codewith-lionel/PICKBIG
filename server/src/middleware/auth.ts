import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../utils/errors.js";
import type { AuthenticatedRequest } from "../types/express.js";

interface TokenPayload {
  userId: string;
  email: string;
}

export function requireAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;

  if (!token) {
    throw new AppError(401, "Authentication required");
  }

  const payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  req.user = { userId: payload.userId, email: payload.email };
  next();
}
