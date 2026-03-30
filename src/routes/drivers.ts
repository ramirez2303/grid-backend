import { Router } from "express";

export const driversRouter = Router();

driversRouter.get("/", (_req, res) => {
  res.json({ message: "GET /api/drivers — not implemented" });
});

driversRouter.get("/:driverId", (req, res) => {
  res.json({ message: `GET /api/drivers/${req.params["driverId"]} — not implemented` });
});
