import { Router } from "express";

export const newsRouter = Router();

newsRouter.get("/", (_req, res) => {
  res.json({ message: "GET /api/news — not implemented" });
});
