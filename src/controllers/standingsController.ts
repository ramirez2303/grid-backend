import type { Request, Response } from "express";
import { getDriverStandings, getConstructorStandings } from "../services/standingsService.js";

import type { ApiResponse } from "../types/api.js";
import type { DriverStandingItem, ConstructorStandingItem } from "../types/standings.js";

export async function listDriverStandings(
  _req: Request,
  res: Response<ApiResponse<DriverStandingItem[]>>,
): Promise<void> {
  try {
    const standings = await getDriverStandings();
    res.json({ success: true, data: standings });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch driver standings";
    res.status(500).json({ success: false, error: message });
  }
}

export async function listConstructorStandings(
  _req: Request,
  res: Response<ApiResponse<ConstructorStandingItem[]>>,
): Promise<void> {
  try {
    const standings = await getConstructorStandings();
    res.json({ success: true, data: standings });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch constructor standings";
    res.status(500).json({ success: false, error: message });
  }
}
