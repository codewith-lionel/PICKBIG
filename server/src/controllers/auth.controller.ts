import type { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth/auth.service.js";

export async function register(req: Request, res: Response) {
  const user = await registerUser(req.body);
  res.status(201).json(user);
}

export async function login(req: Request, res: Response) {
  const result = await loginUser(req.body);
  res.cookie("token", result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  });
  res.json(result);
}
