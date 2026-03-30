import type { Request, Response } from "express";
import { runFullSync } from "../cron/syncData.js";
import { env } from "../config/env.js";

import type { ApiResponse } from "../types/api.js";
import type { SyncResult } from "../cron/syncData.js";

export async function triggerSync(
  req: Request,
  res: Response<ApiResponse<SyncResult>>,
): Promise<void> {
  const apiKey = req.headers["x-api-key"] as string | undefined;

  if (!env.SYNC_API_KEY || apiKey !== env.SYNC_API_KEY) {
    res.status(401).json({ success: false, error: "Invalid or missing API key" });
    return;
  }

  try {
    const result = await runFullSync();
    res.json({ success: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sync failed";
    res.status(500).json({ success: false, error: message });
  }
}
