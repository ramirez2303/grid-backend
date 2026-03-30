import { Router } from "express";
import { listCalendar } from "../controllers/calendarController.js";

export const calendarRouter = Router();

calendarRouter.get("/", listCalendar);
