import { Router } from "express";
import { listDrivers, showDriver } from "../controllers/driversController.js";

export const driversRouter = Router();

driversRouter.get("/", listDrivers);
driversRouter.get("/:driverId", showDriver);
