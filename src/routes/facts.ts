import { Router } from "express";
import { showDailyFact, listFacts } from "../controllers/factsController.js";

export const factsRouter = Router();

factsRouter.get("/daily", showDailyFact);
factsRouter.get("/", listFacts);
