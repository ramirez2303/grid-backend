import type { Request, Response } from "express";
import { getResultsByRound, getLastRaceResults } from "../services/resultsService.js";

import type { ApiResponse } from "../types/api.js";
import type { RaceWithResults } from "../types/result.js";

export async function showResultsByRound(
  req: Request,
  res: Response<ApiResponse<RaceWithResults>>,
): Promise<void> {
  try {
    const roundParam = req.params["round"] as string | undefined;
    if (!roundParam) {
      res.status(400).json({ success: false, error: "Round is required" });
      return;
    }

    const round = Number(roundParam);
    if (isNaN(round)) {
      res.status(400).json({ success: false, error: "Round must be a number" });
      return;
    }

    const results = await getResultsByRound(round);
    if (!results) {
      res.status(404).json({ success: false, error: `No results for round ${round}` });
      return;
    }

    res.json({ success: true, data: results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch results";
    res.status(500).json({ success: false, error: message });
  }
}

export async function showLastRaceResults(
  _req: Request,
  res: Response<ApiResponse<RaceWithResults>>,
): Promise<void> {
  try {
    const results = await getLastRaceResults();
    if (!results) {
      res.status(404).json({ success: false, error: "No race results available yet" });
      return;
    }

    res.json({ success: true, data: results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch last race results";
    res.status(500).json({ success: false, error: message });
  }
}
