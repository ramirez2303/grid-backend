import { Router } from "express";
import { listTeams, showTeam } from "../controllers/teamsController.js";

export const teamsRouter = Router();

teamsRouter.get("/", listTeams);
teamsRouter.get("/:teamId", showTeam);
