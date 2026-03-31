import type { Request, Response } from "express";
import { getAllGlossaryTerms } from "../services/glossaryService.js";

import type { ApiResponse } from "../types/api.js";

export async function listGlossary(_req: Request, res: Response<ApiResponse<unknown>>): Promise<void> {
  try {
    const terms = await getAllGlossaryTerms();
    res.json({ success: true, data: terms });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Failed" });
  }
}
