import type { Request, Response } from "express";
import { getTelemetryComparison } from "../services/telemetryService.js";

import type { ApiResponse } from "../types/api.js";

export async function showTelemetry(req: Request, res: Response<ApiResponse<unknown>>): Promise<void> {
  try {
    const sessionKey = Number(req.params["sessionKey"]);
    const driver1 = Number(req.query["driver1"]);
    const driver2 = Number(req.query["driver2"]);
    const lap = Number(req.query["lap"]);
    if (isNaN(sessionKey) || isNaN(driver1) || isNaN(driver2) || isNaN(lap)) {
      res.status(400).json({ success: false, error: "Required: sessionKey, driver1, driver2, lap (numbers)" });
      return;
    }
    const data = await getTelemetryComparison(sessionKey, driver1, driver2, lap);
    if (!data) { res.status(404).json({ success: false, error: "No telemetry data available" }); return; }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Failed" });
  }
}
