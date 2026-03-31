import type { Request, Response } from "express";
import { getRandomQuestions } from "../services/triviaService.js";

import type { ApiResponse } from "../types/api.js";
import type { TriviaQuestionItem } from "../types/trivia.js";

export async function randomTrivia(req: Request, res: Response<ApiResponse<TriviaQuestionItem[]>>): Promise<void> {
  try {
    const count = Math.min(Number(req.query["count"] ?? 10), 20);
    const questions = await getRandomQuestions(count);
    res.json({ success: true, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Failed" });
  }
}
