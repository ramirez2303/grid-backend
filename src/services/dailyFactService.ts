import { prisma } from "../config/database.js";

import type { DailyFactItem } from "../types/trivia.js";

function dateHash(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash + dateStr.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export async function getDailyFact(): Promise<DailyFactItem | null> {
  const count = await prisma.fact.count();
  if (count === 0) return null;

  const today = new Date().toISOString().slice(0, 10);
  const index = dateHash(today) % count;

  const fact = await prisma.fact.findFirst({ skip: index });
  if (!fact) return null;

  return { id: fact.id, content: fact.content, tags: fact.tags };
}

export async function getFactsByTag(tag: string): Promise<DailyFactItem[]> {
  const facts = await prisma.fact.findMany({
    where: { tags: { has: tag } },
  });
  return facts.map((f) => ({ id: f.id, content: f.content, tags: f.tags }));
}
