import type { Request, Response } from "express";
import { queryNews, fetchAndStoreNews } from "../services/newsService.js";
import { env } from "../config/env.js";

import type { ApiResponse } from "../types/api.js";

export async function listNews(req: Request, res: Response<ApiResponse<unknown>>): Promise<void> {
  try {
    const result = await queryNews({
      source: req.query["source"] as string | undefined,
      topic: req.query["topic"] as string | undefined,
      search: req.query["search"] as string | undefined,
      limit: req.query["limit"] ? Number(req.query["limit"]) : undefined,
      offset: req.query["offset"] ? Number(req.query["offset"]) : undefined,
    });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Failed" });
  }
}

export async function triggerNewsFetch(req: Request, res: Response<ApiResponse<unknown>>): Promise<void> {
  const apiKey = req.headers["x-api-key"] as string | undefined;
  if (!env.SYNC_API_KEY || apiKey !== env.SYNC_API_KEY) {
    res.status(401).json({ success: false, error: "Invalid API key" });
    return;
  }
  try {
    const count = await fetchAndStoreNews();
    res.json({ success: true, data: { stored: count } });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Failed" });
  }
}
