import { prisma } from "../config/prisma.js";

export async function getCachedAI<T>(key: string): Promise<T | null> {
  const row = await prisma.aiCache.findUnique({ where: { cacheKey: key } });
  return (row?.payload as T) ?? null;
}

export async function setCachedAI<T>(key: string, model: string, payload: T): Promise<void> {
  await prisma.aiCache.upsert({
    where: { cacheKey: key },
    update: { payload: payload as object, model },
    create: { cacheKey: key, payload: payload as object, model }
  });
}
