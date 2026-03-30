import { Router } from "express";

export const calendarRouter = Router();

calendarRouter.get("/", (_req, res) => {
  res.json({ message: "GET /api/calendar — not implemented" });
});
