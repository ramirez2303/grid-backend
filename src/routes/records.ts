import { Router } from "express";

export const recordsRouter = Router();

recordsRouter.get("/", (_req, res) => {
  res.json({ message: "GET /api/records — not implemented" });
});
