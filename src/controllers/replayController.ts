import type { Request, Response } from "express";
import { getTrackOutline, getReplayData, getElevationProfile } from "../services/replayService.js";

import type { ApiResponse } from "../types/api.js";

export async function showTrackOutline(req: Request, res: Response<ApiResponse<unknown>>): Promise<void> {
  try {
    const sessionKey = Number(req.params["sessionKey"]);
    if (isNaN(sessionKey)) { res.status(400).json({ success: false, error: "Invalid session key" }); return; }
    const data = await getTrackOutline(sessionKey);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Failed" });
  }
}

export async function showReplayData(req: Request, res: Response<ApiResponse<unknown>>): Promise<void> {
  try {
    const sessionKey = Number(req.params["sessionKey"]);
    if (isNaN(sessionKey)) { res.status(400).json({ success: false, error: "Invalid session key" }); return; }
    const data = await getReplayData(sessionKey);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Failed" });
  }
}

export async function showElevationProfile(req: Request, res: Response<ApiResponse<unknown>>): Promise<void> {
  try {
    const sessionKey = Number(req.params["sessionKey"]);
    if (isNaN(sessionKey)) { res.status(400).json({ success: false, error: "Invalid session key" }); return; }
    const data = await getElevationProfile(sessionKey);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Failed" });
  }
}
