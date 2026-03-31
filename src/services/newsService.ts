import { prisma } from "../config/database.js";
import { fetchAllRssFeeds } from "./rssFetchService.js";
import { classifyNews } from "./newsClassifierService.js";

import type { RawNewsItem } from "./rssFetchService.js";

function titleSimilarity(a: string, b: string): number {
  const wordsA = new Set(a.toLowerCase().split(/\s+/));
  const wordsB = new Set(b.toLowerCase().split(/\s+/));
  const intersection = [...wordsA].filter((w) => wordsB.has(w)).length;
  const union = new Set([...wordsA, ...wordsB]).size;
  return union > 0 ? intersection / union : 0;
}

function deduplicateItems(items: RawNewsItem[], existingTitles: string[]): RawNewsItem[] {
  const seen = new Set<string>();
  const result: RawNewsItem[] = [];

  for (const item of items) {
    if (seen.has(item.sourceUrl)) continue;
    const isDupTitle = existingTitles.some((t) => titleSimilarity(t, item.title) > 0.7);
    if (isDupTitle) continue;
    seen.add(item.sourceUrl);
    result.push(item);
  }

  return result;
}

export async function fetchAndStoreNews(): Promise<number> {
  const rawItems = await fetchAllRssFeeds();
  const existingUrls = await prisma.news.findMany({ select: { sourceUrl: true, title: true } });
  const existingUrlSet = new Set(existingUrls.map((n) => n.sourceUrl));
  const existingTitles = existingUrls.map((n) => n.title);

  const newItems = rawItems.filter((item) => !existingUrlSet.has(item.sourceUrl));
  const deduplicated = deduplicateItems(newItems, existingTitles);

  let stored = 0;
  for (const item of deduplicated) {
    const topics = classifyNews(item.title, item.summary);
    try {
      await prisma.news.create({
        data: { title: item.title, summary: item.summary || null, source: item.source, sourceUrl: item.sourceUrl, imageUrl: item.imageUrl, publishedAt: item.publishedAt, topics },
      });
      stored++;
    } catch { /* duplicate URL constraint */ }
  }

  console.log(`[News] Stored ${stored} new articles (${rawItems.length} fetched, ${deduplicated.length} after dedup)`);
  return stored;
}

export interface NewsQuery { source?: string; topic?: string; search?: string; limit?: number; offset?: number }

export async function queryNews(query: NewsQuery) {
  const where: Record<string, unknown> = {};
  if (query.source) where["source"] = query.source;
  if (query.topic) where["topics"] = { has: query.topic };
  if (query.search) where["title"] = { contains: query.search, mode: "insensitive" };

  const [items, total] = await Promise.all([
    prisma.news.findMany({
      where, orderBy: { publishedAt: "desc" },
      take: query.limit ?? 20, skip: query.offset ?? 0,
    }),
    prisma.news.count({ where }),
  ]);

  return { items, total };
}
