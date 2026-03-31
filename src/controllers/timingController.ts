import type { Request, Response } from "express";
import { getTimingBoard, getPitStopSummary, getStrategyOverview } from "../services/timingService.js";
import { fetchRaceControl, fetchWeather } from "../services/openF1Client.js";
import { transformRaceControl, transformWeather } from "../services/openF1Transform.js";

import type { ApiResponse } from "../types/api.js";

export async function showTimingBoard(req: Request, res: Response<ApiResponse<unknown>>): Promise<void> {
  try {
    const sessionKey = Number(req.params["sessionKey"]);
    if (isNaN(sessionKey)) { res.status(400).json({ success: false, error: "Invalid session key" }); return; }
    const data = await getTimingBoard(sessionKey);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Failed to fetch timing" });
  }
}

export async function showPitStops(req: Request, res: Response<ApiResponse<unknown>>): Promise<void> {
  try {
    const sessionKey = Number(req.params["sessionKey"]);
    if (isNaN(sessionKey)) { res.status(400).json({ success: false, error: "Invalid session key" }); return; }
    const data = await getPitStopSummary(sessionKey);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Failed" });
  }
}

export async function showRaceControl(req: Request, res: Response<ApiResponse<unknown>>): Promise<void> {
  try {
    const sessionKey = Number(req.params["sessionKey"]);
    if (isNaN(sessionKey)) { res.status(400).json({ success: false, error: "Invalid session key" }); return; }
    const raw = await fetchRaceControl(sessionKey);
    res.json({ success: true, data: transformRaceControl(raw) });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Failed" });
  }
}

export async function showWeather(req: Request, res: Response<ApiResponse<unknown>>): Promise<void> {
  try {
    const sessionKey = Number(req.params["sessionKey"]);
    if (isNaN(sessionKey)) { res.status(400).json({ success: false, error: "Invalid session key" }); return; }
    const raw = await fetchWeather(sessionKey);
    res.json({ success: true, data: transformWeather(raw) });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Failed" });
  }
}

export async function showStrategy(req: Request, res: Response<ApiResponse<unknown>>): Promise<void> {
  try {
    const sessionKey = Number(req.params["sessionKey"]);
    if (isNaN(sessionKey)) { res.status(400).json({ success: false, error: "Invalid session key" }); return; }
    const data = await getStrategyOverview(sessionKey);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Failed" });
  }
}
