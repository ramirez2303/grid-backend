import { prisma } from "../config/database.js";

export async function getCachedData<T>(sessionKey: number, endpoint: string): Promise<T[] | null> {
  try {
    const cached = await prisma.timingCache.findFirst({
      where: { sessionKey, endpoint },
    });
    if (!cached) return null;
    return JSON.parse(cached.data) as T[];
  } catch {
    return null;
  }
}

export async function setCachedData<T>(sessionKey: number, endpoint: string, data: T[]): Promise<void> {
  if (data.length === 0) return;
  try {
    const existing = await prisma.timingCache.findFirst({
      where: { sessionKey, endpoint },
    });
    if (existing) {
      await prisma.timingCache.update({
        where: { id: existing.id },
        data: { data: JSON.stringify(data) },
      });
    } else {
      await prisma.timingCache.create({
        data: { sessionKey, endpoint, data: JSON.stringify(data) },
      });
    }
  } catch (err) {
    console.error(`[Cache] Failed to store ${endpoint}:`, err instanceof Error ? err.message : err);
  }
}
