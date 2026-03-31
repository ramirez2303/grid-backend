import { Router } from "express";
import { listNews, triggerNewsFetch } from "../controllers/newsController.js";

export const newsRouter = Router();

newsRouter.get("/", listNews);
newsRouter.post("/sync", triggerNewsFetch);
