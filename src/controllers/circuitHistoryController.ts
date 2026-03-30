import type { Request, Response } from "express";
import { getCircuitWinners } from "../services/circuitHistoryService.js";

import type { ApiResponse } from "../types/api.js";
import type { CircuitWinner } from "../types/circuitHistory.js";

export async function listCircuitWinners(
  req: Request,
  res: Response<ApiResponse<CircuitWinner[]>>,
): Promise<void> {
  try {
    const circuitId = req.params["circuitId"] as string | undefined;
    if (!circuitId) {
      res.status(400).json({ success: false, error: "Circuit ID is required" });
      return;
    }

    const winners = await getCircuitWinners(circuitId);
    res.json({ success: true, data: winners });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch circuit winners";
    res.status(500).json({ success: false, error: message });
  }
}
