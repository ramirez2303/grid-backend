import { Router } from "express";
import { listGlossary } from "../controllers/glossaryController.js";

export const glossaryRouter = Router();

glossaryRouter.get("/", listGlossary);
