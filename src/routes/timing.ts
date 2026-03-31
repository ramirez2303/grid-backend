import { Router } from "express";
import { showTimingBoard, showPitStops, showRaceControl, showWeather, showStrategy } from "../controllers/timingController.js";

export const timingRouter = Router();

timingRouter.get("/:sessionKey", showTimingBoard);
timingRouter.get("/:sessionKey/pitstops", showPitStops);
timingRouter.get("/:sessionKey/racecontrol", showRaceControl);
timingRouter.get("/:sessionKey/weather", showWeather);
timingRouter.get("/:sessionKey/strategy", showStrategy);
