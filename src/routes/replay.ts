import { Router } from "express";
import { showTrackOutline, showReplayData, showElevationProfile } from "../controllers/replayController.js";

export const replayRouter = Router();

replayRouter.get("/:sessionKey/track", showTrackOutline);
replayRouter.get("/:sessionKey/data", showReplayData);
replayRouter.get("/:sessionKey/elevation", showElevationProfile);
