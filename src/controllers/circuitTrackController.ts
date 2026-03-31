import type { Request, Response } from "express";
import { getCircuitTrackData, getCircuitElevation } from "../services/multiviewerService.js";

import type { ApiResponse } from "../types/api.js";

export async function showTrackData(req: Request, res: Response<ApiResponse<unknown>>): Promise<void> {
  try {
    const circuitId = req.params["circuitId"] as string | undefined;
    if (!circuitId) { res.status(400).json({ success: false, error: "Circuit ID required" }); return; }
    const data = await getCircuitTrackData(circuitId);
    if (!data) { res.status(404).json({ success: false, error: "Track data not available for this circuit" }); return; }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Failed" });
  }
}

export async function showElevation(req: Request, res: Response<ApiResponse<unknown>>): Promise<void> {
  try {
    const circuitId = req.params["circuitId"] as string | undefined;
    if (!circuitId) { res.status(400).json({ success: false, error: "Circuit ID required" }); return; }
    const data = await getCircuitElevation(circuitId);
    if (!data) { res.status(404).json({ success: false, error: "Elevation data available after the race is completed" }); return; }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Failed" });
  }
}
