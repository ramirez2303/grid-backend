import { Router } from "express";
import { listMeetings } from "../controllers/meetingsController.js";

export const meetingsRouter = Router();

meetingsRouter.get("/", listMeetings);
