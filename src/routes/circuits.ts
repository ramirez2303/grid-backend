import { Router } from "express";
import { listCircuits, showCircuit } from "../controllers/circuitsController.js";
import { listCircuitWinners } from "../controllers/circuitHistoryController.js";

export const circuitsRouter = Router();

circuitsRouter.get("/", listCircuits);
circuitsRouter.get("/:circuitId", showCircuit);
circuitsRouter.get("/:circuitId/winners", listCircuitWinners);
