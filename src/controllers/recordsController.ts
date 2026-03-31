import type { Request, Response } from "express";
import { getAllRecords } from "../services/recordsService.js";

import type { ApiResponse } from "../types/api.js";
import type { RecordItem } from "../types/trivia.js";

export async function listRecords(_req: Request, res: Response<ApiResponse<RecordItem[]>>): Promise<void> {
  try {
    const records = await getAllRecords();
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Failed" });
  }
}
