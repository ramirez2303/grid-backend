import { Router } from "express";
import { listCircuits, showCircuit } from "../controllers/circuitsController.js";

export const circuitsRouter = Router();

circuitsRouter.get("/", listCircuits);
circuitsRouter.get("/:circuitId", showCircuit);
