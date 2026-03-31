import type { Request, Response } from "express";
import { getGapChartData } from "../services/gapChartService.js";

import type { ApiResponse } from "../types/api.js";

export async function showGapChart(req: Request, res: Response<ApiResponse<unknown>>): Promise<void> {
  try {
    const sessionKey = Number(req.params["sessionKey"]);
    if (isNaN(sessionKey)) { res.status(400).json({ success: false, error: "Invalid session key" }); return; }
    const data = await getGapChartData(sessionKey);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Failed" });
  }
}
