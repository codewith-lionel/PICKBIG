import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma.js";
import { env } from "../../config/env.js";
import { AppError } from "../../utils/errors.js";

export async function registerUser(input: { name: string; email: string; password: string }) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new AppError(409, "Email already registered");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({
    data: { name: input.name, email: input.email, passwordHash },
    select: { id: true, name: true, email: true }
  });

  await prisma.searchPreference.create({
    data: {
      userId: user.id,
      roles: [
        "React Developer",
        "Frontend Developer",
        "MERN Developer",
        "Full Stack Developer",
        "Software Engineer"
      ],
      locations: ["Bengaluru", "Chennai", "Coimbatore", "Kochi", "Kozhikode", "Kerala", "Tamil Nadu", "Remote - India"],
      experienceLevels: ["fresher", "entry", "junior", "trainee", "0-1"]
    }
  });

  return user;
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new AppError(401, "Invalid credentials");
  }

  const validPassword = await bcrypt.compare(input.password, user.passwordHash);
  if (!validPassword) {
    throw new AppError(401, "Invalid credentials");
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, env.JWT_SECRET, { expiresIn: "7d" });
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  };
}
