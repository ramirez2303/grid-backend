import { Router } from "express";

export const triviaRouter = Router();

triviaRouter.get("/random", (_req, res) => {
  res.json({ message: "GET /api/trivia/random — not implemented" });
});
