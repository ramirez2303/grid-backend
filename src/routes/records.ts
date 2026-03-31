import { Router } from "express";
import { listRecords } from "../controllers/recordsController.js";

export const recordsRouter = Router();

recordsRouter.get("/", listRecords);
