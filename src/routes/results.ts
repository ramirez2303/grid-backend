import { Router } from "express";
import { showResultsByRound, showLastRaceResults } from "../controllers/resultsController.js";

export const resultsRouter = Router();

resultsRouter.get("/last", showLastRaceResults);
resultsRouter.get("/:round", showResultsByRound);
