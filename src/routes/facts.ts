import { Router } from "express";

export const factsRouter = Router();

factsRouter.get("/", (_req, res) => {
  res.json({ message: "GET /api/facts — not implemented" });
});
