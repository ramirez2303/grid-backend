import { Router } from "express";
import { listSessions } from "../controllers/meetingsController.js";

export const sessionsRouter = Router();

sessionsRouter.get("/:meetingKey", listSessions);
