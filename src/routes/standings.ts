import { Router } from "express";
import { listDriverStandings, listConstructorStandings } from "../controllers/standingsController.js";

export const standingsRouter = Router();

standingsRouter.get("/drivers", listDriverStandings);
standingsRouter.get("/constructors", listConstructorStandings);
