import { Router } from "express";

export const timingRouter = Router();

timingRouter.get("/:sessionKey", (req, res) => {
  res.json({ message: `GET /api/timing/${req.params["sessionKey"]} — not implemented` });
});
