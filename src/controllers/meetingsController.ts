import type { Request, Response } from "express";
import { fetchMeetings, fetchSessions } from "../services/openF1Client.js";
import { transformMeetings, transformSessions } from "../services/openF1Transform.js";

import type { ApiResponse } from "../types/api.js";

export async function listMeetings(req: Request, res: Response<ApiResponse<unknown>>): Promise<void> {
  try {
    const year = Number(req.query["year"] ?? 2026);
    const raw = await fetchMeetings(year);
    res.json({ success: true, data: transformMeetings(raw) });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Failed to fetch meetings" });
  }
}

export async function listSessions(req: Request, res: Response<ApiResponse<unknown>>): Promise<void> {
  try {
    const meetingKey = Number(req.params["meetingKey"]);
    if (isNaN(meetingKey)) { res.status(400).json({ success: false, error: "Invalid meeting key" }); return; }
    const raw = await fetchSessions(meetingKey);
    res.json({ success: true, data: transformSessions(raw) });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Failed to fetch sessions" });
  }
}
