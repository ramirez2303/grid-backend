import { Router } from "express";
import { randomTrivia } from "../controllers/triviaController.js";

export const triviaRouter = Router();

triviaRouter.get("/random", randomTrivia);
