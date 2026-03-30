import type { Request, Response } from "express";
import { getCalendar } from "../services/calendarService.js";

import type { ApiResponse } from "../types/api.js";
import type { CalendarRace } from "../types/result.js";

export async function listCalendar(
  _req: Request,
  res: Response<ApiResponse<CalendarRace[]>>,
): Promise<void> {
  try {
    const calendar = await getCalendar();
    res.json({ success: true, data: calendar });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch calendar";
    res.status(500).json({ success: false, error: message });
  }
}
