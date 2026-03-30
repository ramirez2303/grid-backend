import { Router } from "express";

export const standingsRouter = Router();

standingsRouter.get("/drivers", (_req, res) => {
  res.json({ message: "GET /api/standings/drivers — not implemented" });
});

standingsRouter.get("/constructors", (_req, res) => {
  res.json({ message: "GET /api/standings/constructors — not implemented" });
});
