import type { Request, Response } from "express";
import { getAllTeams, getTeamById } from "../services/teamsService.js";

import type { ApiResponse } from "../types/api.js";
import type { TeamResponse, TeamListItem } from "../types/team.js";

export async function listTeams(_req: Request, res: Response<ApiResponse<TeamListItem[]>>): Promise<void> {
  try {
    const teams = await getAllTeams();
    res.json({ success: true, data: teams });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch teams";
    res.status(500).json({ success: false, error: message });
  }
}

export async function showTeam(req: Request, res: Response<ApiResponse<TeamResponse>>): Promise<void> {
  try {
    const teamId = req.params["teamId"] as string | undefined;
    if (!teamId) {
      res.status(400).json({ success: false, error: "Team ID is required" });
      return;
    }

    const team = await getTeamById(teamId);
    if (!team) {
      res.status(404).json({ success: false, error: `Team '${teamId}' not found` });
      return;
    }

    res.json({ success: true, data: team });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch team";
    res.status(500).json({ success: false, error: message });
  }
}
