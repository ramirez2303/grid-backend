import type { Request, Response } from "express";
import { getDailyFact, getFactsByTag } from "../services/dailyFactService.js";

import type { ApiResponse } from "../types/api.js";
import type { DailyFactItem } from "../types/trivia.js";

export async function showDailyFact(_req: Request, res: Response<ApiResponse<DailyFactItem | null>>): Promise<void> {
  try {
    const fact = await getDailyFact();
    res.json({ success: true, data: fact });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Failed" });
  }
}

export async function listFacts(req: Request, res: Response<ApiResponse<DailyFactItem[]>>): Promise<void> {
  try {
    const tag = req.query["tag"] as string | undefined;
    const facts = tag ? await getFactsByTag(tag) : [];
    res.json({ success: true, data: facts });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Failed" });
  }
}
