import type { Request, Response } from "express";
import { getAllCircuits, getCircuitById } from "../services/circuitsService.js";

import type { ApiResponse } from "../types/api.js";
import type { CircuitResponse, CircuitListItem } from "../types/circuit.js";

export async function listCircuits(_req: Request, res: Response<ApiResponse<CircuitListItem[]>>): Promise<void> {
  try {
    const circuits = await getAllCircuits();
    res.json({ success: true, data: circuits });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch circuits";
    res.status(500).json({ success: false, error: message });
  }
}

export async function showCircuit(req: Request, res: Response<ApiResponse<CircuitResponse>>): Promise<void> {
  try {
    const circuitId = req.params["circuitId"] as string | undefined;
    if (!circuitId) {
      res.status(400).json({ success: false, error: "Circuit ID is required" });
      return;
    }

    const circuit = await getCircuitById(circuitId);
    if (!circuit) {
      res.status(404).json({ success: false, error: `Circuit '${circuitId}' not found` });
      return;
    }

    res.json({ success: true, data: circuit });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch circuit";
    res.status(500).json({ success: false, error: message });
  }
}
