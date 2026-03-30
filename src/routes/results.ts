import { Router } from "express";

export const resultsRouter = Router();

resultsRouter.get("/:round", (req, res) => {
  res.json({ message: `GET /api/results/${req.params["round"]} — not implemented` });
});
