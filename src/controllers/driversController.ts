import type { Request, Response } from "express";
import { getAllDrivers, getDriverById } from "../services/driversService.js";

import type { ApiResponse } from "../types/api.js";
import type { DriverResponse, DriverListItem } from "../types/driver.js";

export async function listDrivers(_req: Request, res: Response<ApiResponse<DriverListItem[]>>): Promise<void> {
  try {
    const drivers = await getAllDrivers();
    res.json({ success: true, data: drivers });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch drivers";
    res.status(500).json({ success: false, error: message });
  }
}

export async function showDriver(req: Request, res: Response<ApiResponse<DriverResponse>>): Promise<void> {
  try {
    const driverId = req.params["driverId"] as string | undefined;
    if (!driverId) {
      res.status(400).json({ success: false, error: "Driver ID is required" });
      return;
    }

    const driver = await getDriverById(driverId);
    if (!driver) {
      res.status(404).json({ success: false, error: `Driver '${driverId}' not found` });
      return;
    }

    res.json({ success: true, data: driver });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch driver";
    res.status(500).json({ success: false, error: message });
  }
}
