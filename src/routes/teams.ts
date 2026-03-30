import { Router } from "express";

export const teamsRouter = Router();

teamsRouter.get("/", (_req, res) => {
  res.json({ message: "GET /api/teams — not implemented" });
});

teamsRouter.get("/:teamId", (req, res) => {
  res.json({ message: `GET /api/teams/${req.params["teamId"]} — not implemented` });
});
