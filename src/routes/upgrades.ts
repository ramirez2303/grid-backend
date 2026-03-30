import { Router } from "express";

export const upgradesRouter = Router();

upgradesRouter.get("/", (_req, res) => {
  res.json({ message: "GET /api/upgrades — not implemented" });
});
