import { Router } from "express";

export const circuitsRouter = Router();

circuitsRouter.get("/", (_req, res) => {
  res.json({ message: "GET /api/circuits — not implemented" });
});

circuitsRouter.get("/:circuitId", (req, res) => {
  res.json({ message: `GET /api/circuits/${req.params["circuitId"]} — not implemented` });
});
