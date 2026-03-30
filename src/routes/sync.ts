import { Router } from "express";
import { triggerSync } from "../controllers/syncController.js";

export const syncRouter = Router();

syncRouter.post("/", triggerSync);
