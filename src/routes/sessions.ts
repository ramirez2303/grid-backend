import { Router } from "express";

export const sessionsRouter = Router();

sessionsRouter.get("/:meetingKey", (req, res) => {
  res.json({ message: `GET /api/sessions/${req.params["meetingKey"]} — not implemented` });
});
